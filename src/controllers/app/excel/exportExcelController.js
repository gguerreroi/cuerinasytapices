"use strict";
import {connection, mssql} from "../../../config/database";
import {get_credentials} from "../../../utils/get-credentials";
import outApi from "../../../utils/out-api";
import ExcelJS from "exceljs";
import path from 'path';
import fs from 'fs';
const {DB_HOST} = process.env;

function convertToWhereClause(query) {
	console.log('query', query, typeof (query));
/*
	return Object.entries(query)
		.map(([key, value]) => `${key}='${value}'`)
		.join(' AND ');

 */
	const parts = [];

	for (const [key, value] of Object.entries(query || {})) {
		if (value == null || value === "") continue;

		if (Array.isArray(value)) {
			const list = value
				.filter(v => v != null && v !== "")
				.map(v => `'${v}'`)
				.join(", ");
			if (list.length) parts.push(`[${key}] IN (${list})`);
		} else {
			parts.push(`[${key}]='${value}'`);
		}
	}

	return parts.length ? "WHERE " + parts.join(" AND ") : "";
}

async function exportExcel(request, response) {
	const { Username, Database, Password } = get_credentials(request);
	const { view } = request.params;
	let where = request.query;

	let whereClause = convertToWhereClause(where);
	console.log('whereClause', whereClause);
	//whereClause = whereClause.length > 3 ? 'where ' + whereClause : ''

	let Fecha = new Date();



	let Connection = null;
	try {
		// Conexión a la base de datos
		Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
		if (Connection.code === 500) throw { code: Connection.code, message: Connection.message };

		// Consulta a la base de datos
		const sql = `SELECT * FROM ${view} ${whereClause}`;
		console.log('sql', sql)
		const result = await Connection.request().query(sql);

		// Si no hay datos
		if (!result.recordset.length) {
			return response.status(404).send(outApi('204', 'El reporte no contiene datos'));
		}

		// Crear archivo Excel con ExcelJS
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('reporte');
		if (result.recordset.length) {
			worksheet.columns = Object.keys(result.recordset[0]).map(key => ({
				header: key,
				key: key,
				width: 20
			}));
			worksheet.addRows(result.recordset);
		}
		const filePath = path.join(__dirname, 'archivo_datos.xlsx');
		await workbook.xlsx.writeFile(filePath);

		// Descargar el archivo
		response.download(filePath, `Reporte_${view}.xlsx`, (err) => {
			if (err) {
				console.error('Error al descargar el archivo:', err);
				return response.status(500).send(outApi('500', 'Error al descargar el archivo', err));
			}

			// Eliminar el archivo después de descargarlo
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error('Error al eliminar el archivo temporal:', err);
				} else {
					console.log('Archivo temporal eliminado con éxito');
				}
			});
		});
	} catch (e) {
		console.error('Error en el proceso de exportación a Excel:', e);
		return response.status(500).send(outApi('500', 'Error en el proceso de exportación', e));
	}
}

export default exportExcel;
