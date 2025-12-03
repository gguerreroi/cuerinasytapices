"use strict"

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function evaluacionRiesgo(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;
	const { id } = request.params;

	const {
		codriesgo_socioeco,
		codriesgo_vulnerabilidad,
		codriesgo_redes,
		codriesgo_intencion,
		codriesgo_oportunidades,

		dblpuntajeriesgo,
		codnivelriesgo,

		ev_observaciones
	} = request.body;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, DB_HOST, Database);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		// PK
		stmt.input("codriesgomigracion", mssql.Int, id);

		// Evaluación
		stmt.input("codriesgo_socioeco", mssql.Int, codriesgo_socioeco);
		stmt.input("codriesgo_vulnerabilidad", mssql.Int, codriesgo_vulnerabilidad);
		stmt.input("codriesgo_redes", mssql.Int, codriesgo_redes);
		stmt.input("codriesgo_intencion", mssql.Int, codriesgo_intencion);
		stmt.input("codriesgo_oportunidades", mssql.Int, codriesgo_oportunidades);

		stmt.input("dblpuntajeriesgo", mssql.Decimal(5, 2), dblpuntajeriesgo);
		stmt.input("codnivelriesgo", mssql.Int, codnivelriesgo);

		stmt.input("ev_observaciones", mssql.VarChar(mssql.MAX), ev_observaciones);

		// Auditar
		stmt.input("codusuario", mssql.Int, codusuario);

		// OUTPUTS
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(300));

		await stmt.execute("migracion.sp_eval_riesgo", function (err, result) {
			if (err) {
				response.status(500).send(outApi("500", err.message, err));
			} else {
				response.status(200).send(
					outApi(
						result.output.spCodeMessage,
						`${result.output.spStrMessage}`,
						result.recordset
					)
				);
			}
		});

	} catch (err) {
		response.status(500).send(outApi("500", "Error [migracion.sp_eval_riesgo]: " + err.message, err));
	}
}

export default evaluacionRiesgo;