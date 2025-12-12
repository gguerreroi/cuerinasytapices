"use strict";

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function enviosDetalle(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;

	const { id } = request.params; // codenvio

	const {
		coddetalle,        // hidden (0 = insertar | >0 = actualizar)
		codproducto,
		strdescripcion,
		numcantidad,
		numpreciounitario,
		numimporte
	} = request.body;

	let Connection = null;

	try {
		Connection = await connection(
			Username,
			Password,
			`${DB_HOST}`,
			`${Database}`
		);

		if (Connection.code === 500)
			throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		/* ===============================
		   Normalización / validaciones
		=============================== */
		const cantidad = Number(numcantidad) || 0;
		const precio = Number(numpreciounitario) || 0;
		const importeCalc = Math.round(cantidad * precio * 100) / 100;
		const importeFinal =
			Number(numimporte) > 0 ? Number(numimporte) : importeCalc;

		/* ===============================
		   Parámetros de entrada
		=============================== */
		stmt.input("coddetalle", mssql.Int, coddetalle || 0);
		stmt.input("codenvio", mssql.Int, id);
		stmt.input("codproducto", mssql.Int, codproducto || null);
		stmt.input(
			"strdescripcion",
			mssql.VarChar(500),
			strdescripcion.trim().toUpperCase()
		);
		stmt.input("numcantidad", mssql.Decimal(13, 2), cantidad);
		stmt.input("numpreciounitario", mssql.Decimal(13, 2), precio);
		stmt.input("numimporte", mssql.Decimal(13, 2), importeFinal);
		stmt.input("codusuario", mssql.Int, codusuario);

		/* ===============================
		   Parámetros de salida
		=============================== */
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(400));

		/* ===============================
		   Ejecución SP
		=============================== */
		await stmt.execute("envios.sp_detalle", function (err, result) {
			if (err) {
				response
					.status(500)
					.send(outApi("500", err.message, err));
			} else {
				let codstatus = 200;
				if (result.output.spCodeMessage === false) codstatus = 500;

				response.status(codstatus).send(
					outApi(
						result.output.spCodeMessage,
						result.output.spStrMessage,
						result.recordset
					)
				);
			}
		});
	} catch (err) {
		response
			.status(500)
			.send(
				outApi(
					"500",
					"Error [envios.sp_detalle] " + err.message,
					err
				)
			);
	}
}

export default enviosDetalle;