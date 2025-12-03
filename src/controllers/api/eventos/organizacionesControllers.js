"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function organizaciones(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {id} = request.params;
    const {
        strnombre, strsiglas, codestado, codsocio, codmunicipio,
        codtipoorganizacion, datfchingreso, flgregmiembrosocio, numsociom,
        numsociof, flgregempleados, numempm, numempf, flgregareaimp, numareatotalhec,
        numareaimphec, flgnormara, numareacerthec, numareaprodhec, numareaprothec
    } = request.body;

    let Connection = null;
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        let strsocio = "";

        if ( typeof(codsocio) == "object")
            codsocio.map(function(value, index, array){
                strsocio += `${value},`
            })
        if (typeof(codsocio) == "string")
            strsocio += codsocio + ",";

        stmt.input('codorganizacion', mssql.Int, id);
        stmt.input('strnombre', mssql.VarChar(500), strnombre)
        stmt.input('strsiglas', mssql.VarChar(100), strsiglas)
        stmt.input('codestado', mssql.Bit, codestado)
        stmt.input('codsocio', mssql.VarChar(300), strsocio)
        stmt.input('codmunicipio', mssql.Int, codmunicipio)
        stmt.input('codtipoorganizacion', mssql.Int, codtipoorganizacion)
        stmt.input('datfchingreso', mssql.VarChar(10), datfchingreso)
        stmt.input('flgregmiembrosocio', mssql.Bit, flgregmiembrosocio == undefined ? 0 : flgregmiembrosocio)
        stmt.input('numsociom', mssql.Int, flgregmiembrosocio == 1 ? numsociom : 0)
        stmt.input('numsociof', mssql.Int, flgregmiembrosocio == 1 ? numsociof : 0)
        stmt.input('flgregempleados', mssql.Bit, flgregempleados == undefined ? 0 : flgregempleados)
        stmt.input('numempm', mssql.Int, flgregempleados == 1 ? numempm : 0)
        stmt.input('numempf', mssql.Int, flgregempleados == 1 ? numempf : 0)
        stmt.input('flgregareaimp', mssql.Bit, flgregareaimp == undefined ? 0 : flgregareaimp)
        stmt.input('numareatotalhec', mssql.Decimal(8,2), flgregareaimp == 1 ? numareatotalhec : 0)
        stmt.input('numareaimphec', mssql.Decimal(8,2), flgregareaimp == 1 ? numareaimphec : 0)
        stmt.input('flgnormara', mssql.Bit, flgnormara == undefined ? 0 : flgnormara)
        stmt.input('numareacerthec', mssql.Decimal(8,2), flgnormara == 1 ? numareacerthec : 0)
        stmt.input('numareaprodhec', mssql.Decimal(8,2), flgnormara == 1 ? numareaprodhec : 0)
        stmt.input('numareaprothec', mssql.Decimal(8,2), flgnormara == 1 ? numareaprothec : 0)

        stmt.output('spCodState', mssql.Bit);
        stmt.output('spMsjState', mssql.VarChar(400));

        await stmt.execute('organizacion.sp_core', function (err, result) {
            if (err){
                response.status(500).send(outApi('500', err.message, err))
            }else {
                response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
            }
        })
    } catch (err) {
        response.status(500).send(outApi('500', 'Error [sp_organizaciones]', err))
    }
}

export default organizaciones;