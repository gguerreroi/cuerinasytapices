"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function unidadmedida(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {strunidadmedida,strabreviatura, codestado, codcommcare} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codunidadmedida', mssql.Int, id);
        stmt.input('strunidadmedida', mssql.VarChar(100), strunidadmedida)
        stmt.input('strabreviatura', mssql.VarChar(100), strabreviatura)
        stmt.input('codcommcare', mssql.VarChar(100), codcommcare)
        stmt.input('codestado', mssql.Bit, codestado)
        stmt.output('spCodeMessage', mssql.Bit);
        stmt.output('spStrMessage', mssql.VarChar(400));

        await stmt.execute('ventas.sp_unidadmedida', function (err, result) {
            if (err) throw err;

            response.status(200).send(outApi(`${result.output.spCodeMessage}`, `${result.output.spStrMessage}`, result.recordset));
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [unidadmedida]', err))
    }
}

export default unidadmedida;