"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";

const {DB_HOST} = process.env;

async function proyectos(request, response){
	const {Username, Database, Password} = get_credentials(request);
	const {
		codproyecto,
		strcodproyecto,
		strproyecto,
		strsiglas,
		fchinicio,
		fchfin,
		strnoconvenio,
		coddonante,
		codsocio,
		codestado
	} = request.body

	let Connection = null;
	try {
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
		if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}
		const stmt = await Connection.request()
		let strdonantes = ""
		let strsocios = ""

		if ( typeof(coddonante) == "object")
			coddonante.map(function(value, index, array){
				strdonantes += `${value},`
			})
		if (typeof(coddonante) == "string")
			strdonantes += coddonante + ",";

		if ( typeof(codsocio) == "object")
			codsocio.map(function(value, index, array){
				strsocios += `${value},`
			})
		if (typeof(codsocio) == "string")
			strsocios += codsocio + ",";


		stmt.input('codproyecto', mssql.Int, codproyecto);
		stmt.input('strproyecto', mssql.VarChar(500), strproyecto)
		stmt.input('strsiglas', mssql.VarChar(500), strsiglas)
		stmt.input('fchinicio', mssql.VarChar(500), fchinicio)
		stmt.input('fchfin', mssql.VarChar(500), fchfin)
		stmt.input('strnoconvenio', mssql.VarChar(500), strnoconvenio)
		stmt.input('strcodproyecto', mssql.VarChar(500), strcodproyecto)
		stmt.input('coddonante', mssql.VarChar(500), strdonantes)
		stmt.input('codsocio', mssql.VarChar(500), strsocios)
		console.log('codestado', codestado, codestado == undefined ? 0 : 1)
		stmt.input('codestado', mssql.Bit, codestado == undefined ? 0 : 1)
		stmt.output('spCodState', mssql.Bit);
		stmt.output('spMsjState', mssql.VarChar(400));

		await stmt.execute('proyecto.sp_core', function (err, result) {
			if (err){
				response.status(500).send(outApi('500', err.message, err))
			}else {
				response.status(200).send(outApi(`${result.output.spCodState}`, `${result.output.spMsjState}`, result.recordset));
			}
		})


	} catch (err){
		response.status(500).send(outApi('500', 'Error [sp_proyecto]' + err.message, err))
	}
}


export default proyectos