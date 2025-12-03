"use strict"

import mssql from "mssql";
import {get_credentials} from "../../../utils/get-credentials";
import {connection} from "../../../config/database";
import outApi from "../../../utils/out-api";

const {DB_HOST} = process.env;

async function usuarios(request, response){
	const {Username, Database, Password} = get_credentials(request);

	const {
		codusuario,
		strnombre,
		strapellido,
		strusuario,
		strpassword,
		codrole,
		codsocio
	} = request.body;

	let Connection = null;

	try {
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);

		if (Connection.code === 500) throw {code: Connection.code, message: Connection.message};

		const stmt = await Connection.request();

		stmt.input('codusuario', mssql.Int, codusuario);
		stmt.input('strnombre', mssql.VarChar(100), strnombre);
		stmt.input('strapellido', mssql.VarChar(100), strapellido);
		stmt.input('strusuario', mssql.VarChar(100), strusuario);
		stmt.input('strpassword', mssql.VarChar(100), strpassword);
		stmt.input('codestado', mssql.Char(2), 'IA');
		stmt.input('avatar', mssql.VarChar(100), '');
		stmt.input('codrole', mssql.Int, codrole);
		stmt.input('codsocio', mssql.Int, codsocio);

		stmt.output('codMsj', mssql.Bit);
		stmt.output('strMsj', mssql.VarChar(400));

		await stmt.execute('usuarios.sp_core', function (err, result) {
			if (err){
				response.status(500).send(outApi('500', err.message, err));
			} else {
				response.status(200).send(outApi(`${result.output.codMsj}`, `${result.output.strMsj}`, result.recordset));
			}
		});
	} catch (err) {
		response.status(500).send(outApi('500', 'Error [sp_usuarios]' + err.message, err));
	}
}

export default usuarios;
