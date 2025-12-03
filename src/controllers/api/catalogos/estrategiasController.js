"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function estrategias(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {strestrategia, strabreviatura, codproyecto, codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codestrategia', mssql.Int, id);
        stmt.input('strestrategia', mssql.VarChar(mssql.MAX), strestrategia);
        stmt.input('strabreviatura', mssql.VarChar(10), strabreviatura);
        stmt.input('codproyecto', mssql.VarChar(10), codproyecto);
        stmt.input('codestado', mssql.Bit, codestado == undefined ? 0 : 1);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('proyecto.sp_estrategias', function (err, result) {
            if (err) throw err;

            return response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        return response.status(500).send(outApi('500', 'Error [estrategias]', err))
    }
}

async function resultados (request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {codresultado, strresultado, strabreviatura, codestrategia, codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codestrategia', mssql.Int, codestrategia);
        stmt.input('codresultado', mssql.Int, id);
        stmt.input('strresultado', mssql.VarChar(mssql.MAX), strresultado);
        stmt.input('strabreviatura', mssql.VarChar(10), strabreviatura);
         stmt.input('codestado', mssql.Bit, codestado == undefined ? 0 : 1);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('proyecto.sp_resultados', function (err, result) {
            if (err) throw err;

            return response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        return response.status(500).send(outApi('500', 'Error [resultados]', err))
    }
}

async function indicadores (request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {codindicador, strindicador, strabreviatura, codresultado, codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codindicador', mssql.Int, id);
        stmt.input('codresultado', mssql.Int, codresultado);
        stmt.input('strindicador', mssql.VarChar(mssql.MAX), strindicador);
        stmt.input('strabreviatura', mssql.VarChar(10), strabreviatura);
        stmt.input('codestado', mssql.Bit, codestado);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('proyecto.sp_indicadores', function (err, result) {
            if (err) throw err;

            response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [indicadores]', err))
    }
}

export  {estrategias, resultados, indicadores};