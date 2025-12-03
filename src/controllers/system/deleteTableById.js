import { connection, mssql as sql } from "../../config/database";
import { get_credentials } from "../../utils/get-credentials";
import outApi from "../../utils/out-api";

const { DB_HOST } = process.env;

// Permite letras, números, _, ., [] (para schema.[tabla]) — ajusta si usas otros nombres
const IDENT_RX = /^[a-zA-Z0-9_\.\[\]]+$/;
const assertIdent = (name, label) => {
	if (!name || !IDENT_RX.test(name)) {
		const msg = `Identificador inválido para ${label}`;
		const err = new Error(msg);
		err.code = 400;
		throw err;
	}
};

async function deleteTableById(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	let pool = null;

	try {
		const { table, column, id } = request.params;
		let { colname, colvalue } = request.body ?? {};

		// 1) Validaciones mínimas
		assertIdent(table, "table");
		assertIdent(column, "column");
		if (colname) assertIdent(colname, "colname");
		if (id === undefined || id === null || id === "") {
			const err = new Error("Parámetro 'id' es requerido");
			err.code = 400;
			throw err;
		}

		pool = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
		if (pool.code === 500) throw { code: pool.code, message: pool.message };

		// 2) Construcción segura del WHERE (identificadores validados, valores parametrizados)
		let where = `WHERE ${column} = @id`;
		if (colname && colvalue !== undefined) {
			where += ` AND ${colname} = @colvalue`;
		}

		// 3) DELETE parametrizado (opcional: TOP(1) para evitar borrados masivos accidentales)
		const sqlText = `
      DELETE TOP (1) FROM ${table}
      ${where};
    `;

		const req = pool.request()
			.input("id", isFinite(+id) ? sql.Int : sql.VarChar(200), isFinite(+id) ? +id : String(id));

		if (colname && colvalue !== undefined) {
			req.input("colvalue", typeof colvalue === "number" ? sql.Int : sql.VarChar(500), colvalue);
		}

		const result = await req.query(sqlText);
		console.log('rowsAffected raw:', result.rowsAffected);

		const rowsArray = Array.isArray(result.rowsAffected) ? result.rowsAffected : [];
		const rows = rowsArray.length > 0
			? rowsArray[rowsArray.length - 1]   // ← último elemento del array
			: 0;


		if (rows === 0) {
			return response.status(404).send(outApi("404", "No se encontró registro para eliminar"));
		}

		return response.status(200).send(outApi("200", "Eliminación exitosa", { rowsAffected: rows }));
	} catch (err) {
		const status = err.code && Number.isInteger(err.code) ? err.code : 500;
		return response.status(status).send(outApi(String(status), err.message || "Error general"));
	} finally {
		try { if (pool?.close) await pool.close(); } catch {}
	}
}

export default deleteTableById;