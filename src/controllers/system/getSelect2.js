"use strict";
import {connection, mssql} from "../../config/database"
import {get_credentials} from "../../utils/get-credentials";
import outApi from "../../utils/out-api";

const {DB_HOST} = process.env;

async function getSelect2(req, res) {
    const {Username, Database, Password} = get_credentials(req);
    const {view, cod, str} = req.params;
    //const {colname, colvalue} = req.body;
    const {term, _type, q, page, colname, colvalue} = req.query;
    let whr = '';
    let top = '';

    if (page !== undefined && page !== '')
        top = `top(${page})`

    if (term !== undefined && term !== '')
        whr = `(cast(${cod} as varchar) + ${str}) like '%${term.replace(/\s+/g, '%')}%'`

    if (colname !== undefined && colname !== '')
        if (colvalue !== undefined && colvalue !== '')
            whr += `${colname} in (${colvalue})`

    if (whr.length > 3)
        whr = 'WHERE ' + whr


    let Connection = null
    try {
        Connection = await connection(Username, Password, `${DB_HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        let sql = `SELECT distinct ${top} ${cod} as id, cast(${cod} as varchar) + ' ' + ${str} as text FROM ${view} ${whr}`;

        stmt.query(sql, (err, result) => {
            if (err) {
                res.status(500).json(outApi('500', 'Error in query get_catalogue ['+sql+']', err));
            } else {
                res.status(200).json({results: result.recordset});
            }
        });
    } catch (e) {
        res.status(500).json(outApi('500', 'Error in controller get_catalogue', e));
    }
}

export default getSelect2