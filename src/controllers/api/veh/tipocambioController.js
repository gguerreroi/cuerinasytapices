"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";


const {DB_HOST} = process.env;

async function tipocambio(request, response){
    const {Username, Database, Password} = get_credentials(request);

    const {
        codtipocambio,
        codproyecto,
        datfecha,
        codmoneda_local,
        codmoneda_destino,
        dbtipocambio
    } = request.body

    let Connection = null;

    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        console.log('tipocambio', request.body)
        stmt.input('codtipocambio', mssql.Int, codtipocambio);
        stmt.input('datfecha', mssql.VarChar(20), datfecha);
        stmt.input('codproyecto', mssql.Int, codproyecto);
        stmt.input('codmoneda_local', mssql.Int, codmoneda_local);
        stmt.input('codmoneda_destino', mssql.Int, codmoneda_destino);
        stmt.input('dbltipocambio', mssql.Decimal(8,2), dbtipocambio);

        stmt.output('spCodeMessage', mssql.Bit);
        stmt.output('spStrMessage', mssql.VarChar(400));

        await stmt.execute('proyecto.sp_tipocambio', function (err, result) {
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
        response.status(500).send(outApi('500', 'Error [sp_tipocammbio]' + err.message, err))
    }
}


export default tipocambio