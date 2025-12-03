"use strict";

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function hectareas(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;
	const { id } = request.params; // Código de hectárea
	const { datfchregistro, codactividad } = request.body;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		// Procesar actividades (cadena separada por comas)
		let stractividad = "";
		if (typeof codactividad === "object") {
			codactividad.map((value) => {
				stractividad += `${value},`;
			});
		}
		if (typeof codactividad === "string") {
			stractividad += `${codactividad},`;
		}

		// Configurar parámetros de entrada
		stmt.input("codhectarea", mssql.Int, id || 0); // Si no hay ID, asume inserción
		stmt.input("datfchregistro", mssql.Date, datfchregistro);
		stmt.input("codactividad", mssql.VarChar(2000), stractividad);
		stmt.input("codusuario", mssql.Int, codusuario);

		// Configurar parámetros de salida
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(400));

		// Ejecutar el procedimiento almacenado
		await stmt.execute("hectareas.sp_core", function (err, result) {
			if (err) {
				response.status(500).send(outApi("500", err.message, err));
			} else {
				const codstatus = result.output.spCodeMessage ? 200 : 500;
				response.status(codstatus).send(
					outApi(
						result.output.spCodeMessage,
						`${result.output.spStrMessage}`,
						result.recordset
					)
				);
			}
		});
	} catch (err) {
		response.status(500).send(outApi("500", "Error [sp_core_hectareas]: " + err.message, err));
	}
}

export default hectareas;