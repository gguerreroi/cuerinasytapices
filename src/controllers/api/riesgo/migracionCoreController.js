"use strict"

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function migracionCore(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;

	const { id } = request.params;

	// Campos desde el formulario frmriesgo
	const {
		codproyecto,
		dp_numcui, dp_strnombre, dp_strapellido, dp_fchnacimiento, dp_codsexo,
		dp_codestadocivil, dp_codmunicipioresidencia, dp_numhijos,

		cs_codniveleducativo, cs_codsituacionlaboral, cs_codingresohogar,
		cs_codtenenciavivienda, cs_flgremesas,

		ve_flgviolenciacomunidad, ve_strviolenciacomoafecta,
		ve_flgperdidaingresos, ve_flgaccesoserviciosadecuados,

		rm_flgconocepersonasmigraron, rm_strinfluenciamigracion,
		rm_flgconoceviasirregulares, rm_strcualesviasirregulares,
		rm_codintencionmigrar_12m,

		rm_razonmigrar,   // multiple
		rm_coddestino,
		rm_flgredes_apoyo_extranjero,

		co_flginteres_capacitacion,
		codtipoapoyo,   // multiple
		codtipoapoyo_otros,

		oe_strnombreentrevistador,
		oe_datfecha,
		oe_strobservaciones,
		oe_compartirinfo
	} = request.body;

	// Conversión de arreglos → cadena
	const rm_razonmigrarStr = Array.isArray(rm_razonmigrar) ? rm_razonmigrar.join(',') : rm_razonmigrar;
	const codtipoapoyoStr   = Array.isArray(codtipoapoyo)   ? codtipoapoyo.join(',')   : codtipoapoyo;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, DB_HOST, Database);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		// PK
		stmt.input("codriesgomigracion", mssql.Int, id);
		stmt.input("codproyecto", mssql.Int, codproyecto);

		// I. INFORMACIÓN GENERAL
		stmt.input("dp_numcui", mssql.VarChar(15), dp_numcui);
		stmt.input("dp_strnombre", mssql.VarChar(mssql.MAX), dp_strnombre);
		stmt.input("dp_strapellido", mssql.VarChar(mssql.MAX), dp_strapellido);
		stmt.input("dp_fchnacimiento", mssql.VarChar(10), dp_fchnacimiento);
		stmt.input("dp_codsexo", mssql.Char(1), dp_codsexo);
		stmt.input("dp_codestadocivil", mssql.Char(1), dp_codestadocivil);
		stmt.input("dp_codmunicipioresidencia", mssql.Int, dp_codmunicipioresidencia);
		stmt.input("dp_numhijos", mssql.Int, dp_numhijos);

		// II. SOCIOECONÓMICO
		stmt.input("cs_codniveleducativo", mssql.Int, cs_codniveleducativo);
		stmt.input("cs_codsituacionlaboral", mssql.Int, cs_codsituacionlaboral);
		stmt.input("cs_codingresohogar", mssql.Int, cs_codingresohogar);
		stmt.input("cs_codtenenciavivienda", mssql.Int, cs_codtenenciavivienda);
		stmt.input("cs_flgremesas", mssql.Bit, cs_flgremesas != undefined ? 1 : 0);

		// III. VULNERABILIDAD
		stmt.input("ve_flgviolenciacomunidad", mssql.Bit, ve_flgviolenciacomunidad != undefined ? 1 : 0);
		stmt.input("ve_strviolenciacomoafecta", mssql.VarChar(mssql.MAX), ve_strviolenciacomoafecta);
		stmt.input("ve_flgperdidaingresos", mssql.Bit, ve_flgperdidaingresos != undefined ? 1 : 0);
		stmt.input("ve_flgaccesoserviciosadecuados", mssql.Bit, ve_flgaccesoserviciosadecuados != undefined ? 1 : 0);

		stmt.input("rm_flgconocepersonasmigraron", mssql.Bit, rm_flgconocepersonasmigraron != undefined ? 1 : 0);
		stmt.input("rm_strinfluenciamigracion", mssql.VarChar(mssql.MAX), rm_strinfluenciamigracion);
		stmt.input("rm_flgconoceviasirregulares", mssql.Bit, rm_flgconoceviasirregulares != undefined ? 1 : 0);
		stmt.input("rm_strcualesviasirregulares", mssql.VarChar(mssql.MAX), rm_strcualesviasirregulares);
		stmt.input("rm_codintencionmigrar_12m", mssql.Int, rm_codintencionmigrar_12m);

		// MULTISELECT razones
		stmt.input("rm_razonmigrar", mssql.VarChar(mssql.MAX), rm_razonmigrarStr);

		// Destino
		stmt.input("rm_coddestino", mssql.Int, rm_coddestino);
		stmt.input("rm_flgredes_apoyo_extranjero", mssql.Bit, rm_flgredes_apoyo_extranjero != undefined ? 1 : 0);

		// V. OPORTUNIDADES
		stmt.input("co_flginteres_capacitacion", mssql.Bit, co_flginteres_capacitacion != undefined ? 1 : 0);

		// MULTISELECT tipo apoyo
		stmt.input("codtipoapoyo", mssql.VarChar(mssql.MAX), codtipoapoyoStr);
		stmt.input("codtipoapoyo_otros", mssql.VarChar(mssql.MAX), codtipoapoyo_otros);

		// VI. OBSERVACIONES
		stmt.input("oe_strnombreentrevistador", mssql.VarChar(mssql.MAX), oe_strnombreentrevistador);
		stmt.input("oe_datfecha", mssql.VarChar(10), oe_datfecha);
		stmt.input("oe_strobservaciones", mssql.VarChar(mssql.MAX), oe_strobservaciones);
		stmt.input("oe_compartirinfo", mssql.Bit, oe_compartirinfo != undefined ? 1 : 0);

		// Auditoría
		stmt.input("codusuario", mssql.Int, codusuario);

		// OUTPUTS
		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(300));

		// Ejecutar SP
		await stmt.execute("migracion.sp_core", function (err, result) {
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
		response
			.status(500)
			.send(outApi("500", "Error [migracion.sp_core] " + err.message, err));
	}
}

export default migracionCore;