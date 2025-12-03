"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";

const {DB_HOST} = process.env;

async function municipio(request, response){
	const {Username, Database, Password} = get_credentials(request)
	const {
		codmunicipio,
		strmunicipio,
		coddepartamento,
		codcommcare,
		codestado
	} = request.body

	let Connection = null
	try {
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
		if (Connection.code === 500) throw {code: Connection.code, message: Connection.message}
		const stmt = await Connection.request()
		stmt.input('codmunicipio', mssql.Int, codmunicipio)
		stmt.input('strmunicipio', mssql.VarChar(100), strmunicipio)
		stmt.input('coddepartamento', mssql.Int, coddepartamento)
		stmt.input('codcommcare', mssql.VarChar(100), codcommcare)
		stmt.input('codestado', mssql.Bit, codestado != 1 ? '0': '1')
		stmt.output('spCodeMessage', mssql.Bit)
		stmt.output('spStrMessage', mssql.VarChar(400))
		await stmt.execute('geografica.sp_municipio', function (err, result){
			if (err){
				response.status(500).json(outApi('500', err.message, err))
			} else {
				response.status(200).json(outApi(`${result.output.spCodeMessage}`, `${result.output.spStrMessage}`, result.recordset))
			}
		})
	}catch (e) {
		response.status(500).send(outApi('500', 'Error [sp_municipio]' + err.message, err))
	}
}

export default municipio