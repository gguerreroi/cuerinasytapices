"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function ventas(request, response){
    const {Username, Database, Password} = get_credentials(request);
    const {codusuario} = request.session.passport.user
    const {id} = request.params
    const {
        fchventa,
        codactividad
    } = request.body

    let Connection = null;

    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        let stractividad = "";

        if (typeof(codactividad) == "object")
            codactividad.map(function(value, index, array){
                stractividad += `${value},`
            })
        if (typeof(codactividad) == "string")
            stractividad += codactividad + ",";

        stmt.input('codventa', mssql.Int, id);
        stmt.input('datfchventa', mssql.VarChar(20), fchventa)
        stmt.input('codactividad', mssql.VarChar(500), stractividad)
        stmt.input('codusuario', mssql.Int, codusuario)

        stmt.output('spCodeMessage', mssql.Bit);
        stmt.output('spStrMessage', mssql.VarChar(400));

        await stmt.execute('ventas.sp_core', function (err, result) {
            if (err){
                response.status(500).send(outApi('500', err.message, err))
            }else {
                let codstatus=200;
                if (result.output.spCodeMessage == false)
                    codstatus=500
                response.status(codstatus).send(outApi(result.output.spCodeMessage, `${result.output.spStrMessage}`, result.recordset));
            }
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [sp_ventas]' + err.message, err))
    }
}


export default ventas