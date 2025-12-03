"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function poa(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {
        stractividad,
        strcodigoactividad,
        codestrategia,
        codresultado,
        codindicador,
        codsocio,
        codproyecto,
        codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codactividad', mssql.Int, id);
        stmt.input('stractividad', mssql.VarChar(mssql.MAX), stractividad);
        stmt.input('strcodigoactividad', mssql.VarChar(100), strcodigoactividad);
        stmt.input('codestrategia', mssql.Int, codestrategia);
        stmt.input('codresultado', mssql.Int, codresultado);
        stmt.input('codindicador', mssql.Int, codindicador);
        stmt.input('codsocio', mssql.Int, codsocio);
        stmt.input('codproyecto', mssql.Int, codproyecto);
        stmt.input('codestado', mssql.Bit, codestado == undefined ? 0 : 1);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('poa.sp_core', function (err, result) {
            if (err) throw err;

            response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [tipoEventos]', err))
    }
}

export default poa;