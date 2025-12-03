"use strict";

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function hectareasDetalle(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { id } = request.params; // Código de hectárea
	const {
		codsecuencia,
		codorganizacion,
		codcadenavalor,
		codusosuelo,
		codtipocertificacion,
		flgpoligono,
		hreflinkpoligono,
		hreflinkevidencia,
		dblareaimpactada,
		dblareareportadatrim,
		codperteneceareareportada,
		flgpertenecepre
	} = request.body;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		// Configurar parámetros de entrada
		stmt.input("codsecuencia", mssql.Int, codsecuencia || 0); // Si no hay ID, asume inserción
		stmt.input("codhectarea", mssql.Int, id);
		stmt.input("codorganizacion", mssql.Int, codorganizacion);
		stmt.input("codcadenavalor", mssql.Int, codcadenavalor);
		stmt.input("codusosuelo", mssql.Int, codusosuelo);
		stmt.input("codtipocertificacion", mssql.Int, codtipocertificacion);
		stmt.input("flgpoligono", mssql.Bit, flgpoligono != undefined ? 1 : 0);
		stmt.input("hreflinkpoligono", mssql.VarChar(1000), hreflinkpoligono);
		stmt.input("hreflinkevidencia", mssql.VarChar(1000), hreflinkevidencia);
		stmt.input("dblareaimpactada", mssql.Decimal(8, 2), dblareaimpactada);
		stmt.input("dblareareportadatrim", mssql.Decimal(8, 2), dblareareportadatrim);
		stmt.input("codperteneceareareportada", mssql.Int, codperteneceareareportada);
		stmt.input("flgpertenecepre", mssql.Bit, flgpertenecepre ? 1 : 0);

		// Configurar parámetros de salida
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(400));

		// Ejecutar el procedimiento almacenado
		await stmt.execute("hectareas.sp_detalle", function (err, result) {
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
		response
			.status(500)
			.send(outApi("500", "Error [sp_detalle_hectareas]: " + err.message, err));
	}
}

export default hectareasDetalle;