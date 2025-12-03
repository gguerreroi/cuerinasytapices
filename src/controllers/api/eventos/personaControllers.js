"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function persona(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const { strnombres,
        strapellidos,
        fanionac,
        codgenero,
        codcomunidadlinguistica,
        numcelular,
        codorganizaciones,
        codproyecto,
        email } = request.body;

    let Connection = null;

    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        let strorganizaciones = "";
        let strproyectos = "";

        if ( typeof(codorganizaciones) == "object" )
            codorganizaciones.map(function(value, index, array){
                    strorganizaciones += `${value},`
            })

        if (typeof(codorganizaciones) == "string" )
            strorganizaciones += codorganizaciones + ",";

        if ( typeof(codproyecto) == "object" )
            codproyecto.map(function(value, index, array){
                strproyectos += `${value},`
            })

        if (typeof(codproyecto) == "string")
            strproyectos += codproyecto + ",";

        stmt.input('codpersona', mssql.Int, id);
        stmt.input('strnombres', mssql.VarChar(100), strnombres)
        stmt.input('strapellidos', mssql.VarChar(100), strapellidos)
        stmt.input('fanionac', mssql.Int, fanionac)
        stmt.input('codgenero', mssql.VarChar(1), codgenero)
        stmt.input('codcomunidadlinguistica', mssql.Int, codcomunidadlinguistica)
        stmt.input('numcelular', mssql.VarChar(8), numcelular)
        stmt.input('email', mssql.VarChar(50), email)
        stmt.input('codorganizaciones', mssql.VarChar(400), strorganizaciones)
        stmt.input('codproyectos', mssql.VarChar(400), strproyectos)
        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('eventos.sp_personas', function (err, result) {
            if (err){
                response.status(500).send(outApi('500', 'Error '+ err.message, err))
            } else {
                response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
            }
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [sp_personas] '+err.message, err))
    }
}

export default persona;