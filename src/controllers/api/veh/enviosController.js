"use strict"

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function envios(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;
	const { id } = request.params; // codenvio

	const {
		datfecha,
		numdocumento,
		numcaja,
		numpedido,
		datfpedido,
		strcliente,
		numnit,
		strdireccion,
		stragente,
		numflete,
		numdescuento,

		strformadepago, // puede venir como string o como array
		strtransporte
	} = request.body;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		// Normalizar forma de pago (puede venir como string o arreglo)
		let formas = [];
		if (Array.isArray(strformadepago)) {
			formas = strformadepago;
		} else if (typeof strformadepago === "string" && strformadepago.trim() !== "") {
			formas = [strformadepago];
		}

		const flgefectivo = formas.includes("EFECTIVO");
		const flgcheque  = formas.includes("CHEQUE");
		const flgtarjeta = formas.includes("TARJETA");
		const flgdep     = formas.includes("DEPOSITO");

		// Inputs del encabezado de envíos
		stmt.input("codenvio",       mssql.Int,        id);
		stmt.input("numdocumento",   mssql.Int,        numdocumento || 0);
		stmt.input("numcaja",        mssql.Int,        numcaja || null);
		stmt.input("datfecha",       mssql.Date,       datfecha);
		stmt.input("strcliente",     mssql.VarChar(200), strcliente);
		stmt.input("strdireccion",   mssql.VarChar(300), strdireccion || null);
		stmt.input("numnit",         mssql.VarChar(20),  numnit || null);
		stmt.input("stragente",      mssql.VarChar(100), stragente || null);
		stmt.input("numpedido",      mssql.Int,        numpedido || null);
		stmt.input("datfpedido",     mssql.Date,       datfpedido || null);
		stmt.input("strformadepago", mssql.VarChar(mssql.MAX), strformadepago);
		stmt.input("strtransporte", mssql.VarChar(mssql.MAX), strtransporte);

		// Forma de pago en bits
		stmt.input("flgefectivo",    mssql.Bit,        flgefectivo);
		stmt.input("flgcheque",      mssql.Bit,        flgcheque);
		stmt.input("flgtarjeta",     mssql.Bit,        flgtarjeta);
		stmt.input("flgdep",         mssql.Bit,        flgdep);

		// Totales
		stmt.input("numflete",       mssql.Decimal(18, 2), numflete || 0);
		stmt.input("numdescuento",   mssql.Decimal(18, 2), numdescuento || 0);
		stmt.input("numtotal",       mssql.Decimal(18, 2),  0);

		// Auditoría
		stmt.input("codusuario",     mssql.Int,        codusuario);

		// Outputs estándar
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage",  mssql.VarChar(400));

		await stmt.execute("envios.sp_core", function (err, result) {
			if (err) {
				response.status(500).send(outApi("500", err.message, err));
			} else {
				let codstatus = 200;
				if (result.output.spCodeMessage === false)
					codstatus = 500;

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
			.send(outApi("500", "Error [envios.sp_core] " + err.message, err));
	}
}

export default envios;