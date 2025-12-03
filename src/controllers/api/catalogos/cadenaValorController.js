"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function categoriacdv(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {strcategoria, codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codcategoria', mssql.Int, id);
        stmt.input('strcategoria', mssql.VarChar(100), strcategoria);
        stmt.input('codestado', mssql.Bit, codestado);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('cadenavalor.sp_categoria', function (err, result) {
            if (err) throw err;

            return response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        return response.status(500).send(outApi('500', 'Error [categoriacdv]', err))
    }
}

async function cadenavalor (request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {codcategoria, strcadenavalor, codcommcare, codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codcategoria', mssql.Int, codcategoria);
        stmt.input('codcadenavalor', mssql.Int, id);
        stmt.input('strcadenavalor', mssql.VarChar(100), strcadenavalor);
        stmt.input('codcommcare', mssql.VarChar(100), codcommcare);
        stmt.input('codestado', mssql.Bit, codestado);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('cadenavalor.sp_core', function (err, result) {
            if (err) throw err;

            return response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        return response.status(500).send(outApi('500', 'Error [cadenavalor]', err))
    }
}

async function producto (request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {codcadenavalor, strproducto, codcommcare, codestado} = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.input('codproducto', mssql.Int, id);
        stmt.input('codcadenavalor', mssql.Int, codcadenavalor);
        stmt.input('strproducto', mssql.VarChar(100), strproducto);
        stmt.input('codcommcare', mssql.VarChar(100), codcommcare);
        stmt.input('codestado', mssql.Bit, codestado);
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('cadenavalor.sp_producto', function (err, result) {
            if (err) throw err;

            response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [producto]', err))
    }
}

export  {categoriacdv, cadenavalor, producto};