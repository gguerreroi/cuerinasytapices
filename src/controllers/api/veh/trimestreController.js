"use strict"

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function trimestre(request, response) {
    const { Username, Database, Password } = get_credentials(request);

    const {
        codtrimestre,
        codproyecto,
        datfecha,
        codsocio,
        codestado
    } = request.body;

    let Connection = null;

    try {
        // Conectar a la base de datos
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

        // Verificar que la conexión fue exitosa
        if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

        // Preparar la solicitud SQL
        const stmt = await Connection.request();

        console.log('trimestre', request.body);

        // Configurar los parámetros de la consulta
        stmt.input('codtrimestre', mssql.Int, codtrimestre);
        stmt.input('codproyecto', mssql.Int, codproyecto);
        stmt.input('datfecha', mssql.Date, datfecha); // Cambié el tipo a mssql.Date
        stmt.input('codsocio', mssql.Int, codsocio);
        stmt.input('codestado', mssql.Bit, codestado != undefined ? codestado : 0);

        // Parámetros de salida
        stmt.output('spCodeMessage', mssql.Bit);
        stmt.output('spStrMessage', mssql.VarChar(400));

        // Ejecutar el procedimiento almacenado
        const result = await stmt.execute('proyecto.sp_trimestre');

        // Verificar el código de mensaje de salida y responder adecuadamente
        console.log('result.output', result.output);
        const codstatus = result.output.spCodeMessage == 1 ? 200 : 500;
        const message = result.output.spStrMessage;

        // Responder con la salida estandarizada
        response.status(codstatus).send(outApi(result.output.spCodeMessage, message, result.recordset));

    } catch (err) {
        // Manejo de errores
        response.status(500).send(outApi('500', 'Error [sp_trimestre]: ' + err.message, err));
    }
}

export default trimestre;
