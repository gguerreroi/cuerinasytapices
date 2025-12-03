"use strict";

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function empleosDetalle(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { id } = request.params; // Código de empleo (codempleo)
	const {
		codsecuencia, // Identificador para actualizar/inserción
		codorganizacion,
		codproducto,
		codcomunidadlinguistica,
		muj_18_29_jorn,
		muj_18_29_temp,
		muj_18_29_perm,
		muj_30_99_jorn,
		muj_30_99_temp,
		muj_30_99_perm,
		hom_18_29_jorn,
		hom_18_29_temp,
		hom_18_29_perm,
		hom_30_99_jorn,
		hom_30_99_temp,
		hom_30_99_perm,
	} = request.body;

	let Connection = null;

	try {
		// Establecer la conexión a la base de datos
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		// Establecer parámetros de entrada
		stmt.input("codsecuencia", mssql.Int, codsecuencia || 0); // Si no hay ID, asumir inserción
		stmt.input("codempleo", mssql.Int, id);
		stmt.input("codorganizacion", mssql.Int, codorganizacion);
		stmt.input("codproducto", mssql.Int, codproducto);
		stmt.input("codcomunidadlinguistica", mssql.Int, codcomunidadlinguistica);
		stmt.input("muj_18_29_jorn", mssql.Int, muj_18_29_jorn);
		stmt.input("muj_18_29_temp", mssql.Int, muj_18_29_temp);
		stmt.input("muj_18_29_perm", mssql.Int, muj_18_29_perm);
		stmt.input("muj_30_99_jorn", mssql.Int, muj_30_99_jorn);
		stmt.input("muj_30_99_temp", mssql.Int, muj_30_99_temp);
		stmt.input("muj_30_99_perm", mssql.Int, muj_30_99_perm);
		stmt.input("hom_18_29_jorn", mssql.Int, hom_18_29_jorn);
		stmt.input("hom_18_29_temp", mssql.Int, hom_18_29_temp);
		stmt.input("hom_18_29_perm", mssql.Int, hom_18_29_perm);
		stmt.input("hom_30_99_jorn", mssql.Int, hom_30_99_jorn);
		stmt.input("hom_30_99_temp", mssql.Int, hom_30_99_temp);
		stmt.input("hom_30_99_perm", mssql.Int, hom_30_99_perm);

		// Establecer parámetros de salida
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(400));

		// Ejecutar el procedimiento almacenado
		await stmt.execute("empleos.sp_detalle", function (err, result) {
			if (err) {
				response.status(500).send(outApi("500", err.message, err));
			} else {
				let codstatus = 200;
				if (result.output.spCodeMessage === false) codstatus = 500;
				response
					.status(codstatus)
					.send(
						outApi(
							result.output.spCodeMessage,
							`${result.output.spStrMessage}`,
							result.recordset
						)
					);
			}
		});
	} catch (err) {
		response
			.status(500)
			.send(outApi("500", "Error [sp_detalle_empleos]" + err.message, err));
	}
}

export default empleosDetalle;
