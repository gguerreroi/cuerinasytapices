"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function eventos(request, response){
    const {Username, Database, Password} = get_credentials(request);
    const {codusuario} = request.session.passport.user
    const {
        codevento,
        strevento,
        codproyecto,
        codtipoevento,
        qfy,
        datfchinicio,
        datfchfin,
        numhoras,
        numcosto,
        codmunicipio,
        codtema,
        codcategoria,
        codactividad,
        strlinkevidencia,
        strresponsable,
        codparticipantes
    } = request.body

    let Connection = null;

    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        let strparticipantes = "";
        let strproyecto = "";
        let stractividad = "";

        if ( typeof(codparticipantes) == "object")
            codparticipantes.map(function(value, index, array){
                strparticipantes += `${value},`
            })
        if (typeof(codparticipantes) == "string")
            strparticipantes += codparticipantes + ",";

        if ( typeof(codproyecto) == "object")
            codproyecto.map(function(value, index, array){
                strproyecto += `${value},`
            })
        if (typeof(codproyecto) == "string")
            strproyecto += codproyecto + ",";

        if (typeof(codactividad) == "object")
            codactividad.map(function(value, index, array){
                stractividad += `${value},`
            })
        if (typeof(codactividad) == "string")
            stractividad += codactividad + ",";

        stmt.input('codevento', mssql.Int, codevento);
        stmt.input('strevento', mssql.VarChar(mssql.MAX), strevento)
        stmt.input('codproyecto', mssql.VarChar(500), strproyecto)
        stmt.input('codtipoevento', mssql.Int, codtipoevento)
        stmt.input('qfy', mssql.VarChar(10), qfy)
        stmt.input('datfchinicio', mssql.VarChar(20), datfchinicio)
        stmt.input('datfchfin', mssql.VarChar(20), datfchfin)
        stmt.input('numhoras', mssql.Decimal(8,2), numhoras)
        stmt.input('numcosto', mssql.Decimal(8,2), numcosto)
        stmt.input('codmunicipio', mssql.Int, codmunicipio)
        stmt.input('codtema', mssql.Int, codtema)
        stmt.input('codcategoria', mssql.Int, codcategoria)
        stmt.input('codactividad', mssql.VarChar(500), stractividad)
        stmt.input('strlinkevidencia', mssql.VarChar(1000), strlinkevidencia)
        stmt.input('strresponsable', mssql.VarChar(200), strresponsable)
        stmt.input('codparticipantes', mssql.VarChar(2000), strparticipantes)
        stmt.input('codusuario', mssql.Int, codusuario)

        stmt.output('spCodeMessage', mssql.Bit);
        stmt.output('spStrMessage', mssql.VarChar(400));

        await stmt.execute('eventos.sp_core', function (err, result) {
            if (err){
                response.status(500).send(outApi('500', err.message, err))
            }else {
                response.status(200).send(outApi(`${result.output.spCodeMessage}`, `${result.output.spStrMessage}`, result.recordset));
            }
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [sp_eventos]' + err.message, err))
    }
}


export default eventos