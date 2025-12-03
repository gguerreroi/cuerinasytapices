"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function socio(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {strsocio,
        strsiglas,
        codmunicipio,
        codcommcare,
        codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codsocio', mssql.Int, id);
        stmt.input('strsocio', mssql.VarChar(100), strsocio);
        stmt.input('strsiglas', mssql.VarChar(100), strsiglas);
        stmt.input('codmunicipio', mssql.Int, codmunicipio);
        stmt.input('codestado', mssql.Bit, codestado);
        stmt.input('codcommcare', mssql.VarChar(100), codcommcare);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('poa.sp_socio', function (err, result) {
            if (err) throw err;

            response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [tipoEventos]', err))
    }
}

export default socio;