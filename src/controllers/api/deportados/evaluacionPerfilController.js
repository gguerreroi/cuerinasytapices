"use strict"

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function evaluacionPerfil(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;
	const {id} = request.params;
	const {
		elig_basica,
		reinsercion,
		vulnerabilidad,
		compatibilidad,

		treinsercion,
		tvulnerabilidad,
		tcompatibilidad,
		tpuntaje,

		flgevaluacionfinalperfil,
		strrazonnocumple,
		strrazoncumple,
		codtipoapoyoautorizado,
		strotrotipoapoyo,
		strnombreresponsableprl,
		strlinkevidencia,
		flgmodnegocio,
		modnegocio_monto,
		modnegocio_cv,
		datfechadecision,
		datfechaseguimiento
	} = request.body;

	let Connection = null;
	const elig_basicaStr = Array.isArray(elig_basica) ? elig_basica.join(',') : elig_basica;
	const reinsercionStr = Array.isArray(reinsercion) ? reinsercion.join(',') : reinsercion;
	const vulnerabilidadStr = Array.isArray(vulnerabilidad) ? vulnerabilidad.join(',') : vulnerabilidad;
	const compatibilidadStr = Array.isArray(compatibilidad) ? compatibilidad.join(',') : compatibilidad;
	const modnegociocvStr = Array.isArray(modnegocio_cv) ? modnegocio_cv.join(',') : modnegocio_cv;

	try {
		Connection = await connection(Username, Password, DB_HOST, Database);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		stmt.input("codretornado", mssql.Int, id);
		stmt.input("flgevaluacionfinalperfil", mssql.Int, flgevaluacionfinalperfil);
		stmt.input("strrazonnocumple", mssql.VarChar(mssql.MAX), strrazonnocumple);
		stmt.input("strrazoncumple", mssql.VarChar(mssql.MAX), strrazoncumple);
		stmt.input("codtipoapoyoautorizado", mssql.Int, codtipoapoyoautorizado);
		stmt.input("strotrotipoapoyo", mssql.VarChar(mssql.MAX), strotrotipoapoyo);
		stmt.input("strnombreresponsableprl", mssql.VarChar(mssql.MAX), strnombreresponsableprl);
		stmt.input("strlinkevidencia", mssql.VarChar(mssql.MAX), strlinkevidencia);
		stmt.input("flgmodnegocio", mssql.Int, flgmodnegocio != undefined ? 1 : 0);
		stmt.input("modnegocio_monto", mssql.Decimal(18,2), modnegocio_monto);
		stmt.input("datfechadecision", mssql.VarChar(20), datfechadecision);
		stmt.input("datfechaseguimiento", mssql.VarChar(20), datfechaseguimiento);
		stmt.input("_atuserlastmodified", mssql.Int, codusuario);

		stmt.input("elig_basica", mssql.VarChar(mssql.MAX), elig_basicaStr);
		stmt.input("reinsercion", mssql.VarChar(mssql.MAX), reinsercionStr);
		stmt.input("vulnerabilidad", mssql.VarChar(mssql.MAX), vulnerabilidadStr);
		stmt.input("compatibilidad", mssql.VarChar(mssql.MAX), compatibilidadStr);
		stmt.input("modnegocio_cv", mssql.VarChar(mssql.MAX), modnegociocvStr);

		stmt.input("treinsercion", mssql.Int, treinsercion);
		stmt.input("tvulnerabilidad", mssql.Int, tvulnerabilidad);
		stmt.input("tcompatibilidad", mssql.Int, tcompatibilidad);
		stmt.input("tpuntaje", mssql.Int, tpuntaje);

		stmt.output("spCodeMessage", mssql.Int);
		stmt.output("spStrMessage", mssql.NVarChar(mssql.MAX));

		await stmt.execute("retornados.sp_update_decision_prl", function (err, result) {
			if (err) {
				response.status(500).send(outApi("500", err.message, err));
			} else {
				response.status(200).send(outApi(
					result.output.spCodeMessage,
					`${result.output.spStrMessage}`,
					result.recordset
				));
			}
		});
	} catch (err) {
		response.status(500).send(outApi("500", "Error [update_decision_prl]: " + err.message, err));
	}
}

export default evaluacionPerfil;