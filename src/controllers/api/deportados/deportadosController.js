"use strict"

import mssql from "mssql";
import { get_credentials } from "../../../utils/get-credentials";
import { connection } from "../../../config/database";
import outApi from "../../../utils/out-api";

const { DB_HOST } = process.env;

async function deportados(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { codusuario } = request.session.passport.user;

	const {id} = request.params;
	// lastes
	const {
		codproyecto,
		dp_numcui, dp_strnombre, dp_strapellido, dp_fchnacimiento, dp_codsexo,
		dp_codestadocivil, dp_codmunicipioresidencia, dp_numhijos, dp_telefono, dp_email, dp_flgjefehogar,
		dm_codpaisdeportado, dm_fchdeportacion, dm_duracionextranhero, dm_flgmigrar, dm_migrarcuando,
		dm_strmotivodemigracion, dm_codactividadeconomicaextranjero,dm_codactividadeconomicaextranjero_otros,
		sa_stractividadactual, sa_stractividadactual_otros,
		sa_codniveleducativo, sa_flgoficioohabilidadtecnica, sa_cualoficioohabilidadtecnica,
		sa_piensadedicar, sa_flgemprendimiento, sa_rubroemprendimiento, sa_rubroemprendimiento_otros, sa_quenecesitaparadesarrollar,
		sa_flgterrenopropiooaccesoatierra, sa_dondeterrenopropiooaccesoatierra, sa_tamaniopropiedadm2,
		sa_flginteresadocapacitarse, sa_enquecapacitarse, sa_enquecapacitarse_otros,
		codvulnerabilidades, codintereses,
		oe_strnombreentrevistador, oe_datfecha, oe_strobservaciones, oe_compartirinfo,
		codestado
	} = request.body;


	const codvulnerabilidadesStr = Array.isArray(codvulnerabilidades) ? codvulnerabilidades.join(',') : codvulnerabilidades;
	const codinteresesStr = Array.isArray(codintereses) ? codintereses.join(',') : codintereses;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, DB_HOST, Database);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		const stmt = await Connection.request();

		stmt.input("codretornado", mssql.Int, id);
		stmt.input("codproyecto", mssql.Int, codproyecto);
		stmt.input("dp_numcui", mssql.VarChar(100), dp_numcui);
		stmt.input("dp_strnombre", mssql.VarChar(mssql.MAX), dp_strnombre);
		stmt.input("dp_strapellido", mssql.VarChar(mssql.MAX), dp_strapellido);
		stmt.input("dp_fchnacimiento", mssql.Date, dp_fchnacimiento);
		stmt.input("dp_codsexo", mssql.Char(1), dp_codsexo);
		stmt.input("dp_codestadocivil", mssql.Char(1), dp_codestadocivil);
		stmt.input("dp_codmunicipioresidencia", mssql.Int, dp_codmunicipioresidencia);
		stmt.input("dp_numhijos", mssql.Int, dp_numhijos);
		stmt.input("dp_telefono", mssql.VarChar(100), dp_telefono);
		stmt.input("dp_email", mssql.VarChar(100), dp_email);
		stmt.input("dp_flgjefehogar", mssql.Bit, dp_flgjefehogar != undefined ? 1 : 0);
		stmt.input("dm_codpaisdeportado", mssql.Int, dm_codpaisdeportado);
		stmt.input("dm_fchdeportacion", mssql.Date, dm_fchdeportacion);
		stmt.input("dm_duracionextranhero", mssql.Int, dm_duracionextranhero);
		stmt.input("dm_flgmigrar", mssql.Bit, dm_flgmigrar != undefined ? 1 : 0);
		stmt.input("dm_migrarcuando", mssql.VarChar(mssql.MAX), dm_migrarcuando);
		stmt.input("dm_strmotivodemigracion", mssql.VarChar(mssql.MAX), dm_strmotivodemigracion);
		stmt.input("dm_codactividadeconomicaextranjero", mssql.Int, dm_codactividadeconomicaextranjero);
		stmt.input("dm_codactividadeconomicaextranjero_otros", mssql.VarChar(mssql.MAX), dm_codactividadeconomicaextranjero_otros);
		stmt.input("sa_stractividadactual", mssql.VarChar(mssql.MAX), sa_stractividadactual);
		stmt.input("sa_stractividadactual_otros", mssql.VarChar(mssql.MAX), sa_stractividadactual_otros);
		stmt.input("sa_codniveleducativo", mssql.Int, sa_codniveleducativo);
		stmt.input("sa_flgoficioohabilidadtecnica", mssql.Bit, sa_flgoficioohabilidadtecnica);
		stmt.input("sa_cualoficioohabilidadtecnica", mssql.VarChar(mssql.MAX), sa_cualoficioohabilidadtecnica);
		stmt.input("sa_piensadedicar", mssql.Int, sa_piensadedicar);
		stmt.input("sa_flgemprendimiento", mssql.VarChar(mssql.Char(1)), sa_flgemprendimiento);
		stmt.input("sa_rubroemprendimiento", mssql.Int, sa_rubroemprendimiento);
		stmt.input("sa_rubroemprendimiento_otros", mssql.VarChar(mssql.MAX), sa_rubroemprendimiento_otros);
		stmt.input("sa_quenecesitaparadesarrollar", mssql.VarChar(mssql.MAX), sa_quenecesitaparadesarrollar);
		stmt.input("sa_flgterrenopropiooaccesoatierra", mssql.Bit, sa_flgterrenopropiooaccesoatierra != undefined ? 1 : 0);
		stmt.input("sa_dondeterrenopropiooaccesoatierra", mssql.VarChar(mssql.MAX), sa_dondeterrenopropiooaccesoatierra);
		stmt.input("sa_tamaniopropiedadm2", mssql.VarChar(mssql.MAX), sa_tamaniopropiedadm2);
		stmt.input("sa_flginteresadocapacitarse", mssql.Bit, sa_flginteresadocapacitarse != undefined ? 1 : 0);
		stmt.input("sa_enquecapacitarse", mssql.Int, sa_enquecapacitarse);
		stmt.input("sa_enquecapacitarse_otros", mssql.VarChar(mssql.MAX), sa_enquecapacitarse_otros);

		stmt.input("codvulnerabilidades", mssql.VarChar(mssql.MAX), codvulnerabilidadesStr);
		stmt.input("codintereses", mssql.VarChar(mssql.MAX), codinteresesStr);
		stmt.input("oe_strnombreentrevistador", mssql.VarChar(mssql.MAX), oe_strnombreentrevistador);
		stmt.input("oe_datfecha", mssql.VarChar(100), oe_datfecha);
		stmt.input("oe_strobservaciones", mssql.VarChar(mssql.MAX), oe_strobservaciones);
		stmt.input("oe_compartirinfo", mssql.Bit, oe_compartirinfo);

		stmt.input("codestado", mssql.Int, codestado);
		stmt.input("codusuario", mssql.Int, codusuario);

		stmt.output("spCodeMessage", mssql.Bit);
		stmt.output("spStrMessage", mssql.VarChar(300));

		await stmt.execute("retornados.sp_core", function (err, result) {
			if (err) {
				response.status(500).send(outApi("500", err.message, err));
			} else {
				response.status(200).send(outApi(result.output.spCodeMessage, `${result.output.spStrMessage}`, result.recordset));
			}
		});
	} catch (err) {
		response.status(500).send(outApi("500", "Error [sp_retornados]" + err.message, err));
	}
}

export default deportados;