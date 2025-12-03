"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function donante(request, response) {

    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {strdonante, codestado, flgcomparte} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('coddonante', mssql.Int, id);
        stmt.input('strdonante', mssql.VarChar(100), strdonante)
        stmt.input('codestado', mssql.Bit, codestado == undefined ? 0 : 1);
        stmt.input('flgcomparte', mssql.Bit, flgcomparte == undefined ? 0 : 1);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('proyecto.sp_donante', function (err, result) {
            if (err){
                response.status(500).send(outApi('500', 'Error in execute [donante]', err))
            } else {
                response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
            }
            
        })
    } catch (err) {

        response.status(500).send(outApi('500', 'Error [donante]', err))
    }
}

export default donante;