import {connection, mssql} from "../../config/database"
import {get_credentials} from "../../utils/get-credentials";
import outApi from "../../utils/out-api";
const {DB_HOST} = process.env;

async function getOneFromTable(req, res) {
    const {Username, Database, Password} = get_credentials(req);
    const {view, column, id} = req.params;
    let whr = `${column} = ${id}`;
    let Connection = null
    try{
        Connection = await connection(Username, Password, `${DB_HOST}`, Database);
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        let sql = `SELECT * FROM ${view} WHERE ${whr}`;
        stmt.query(sql, (err, result) => {
            if (err)
                return res.status(500).send(outApi('500', 'Error in query get_catalogue', err));

            return res.status(200).send(outApi('200','Consulta Exitosa', result.recordset));

        });
    }catch(e){
        return res.status(500).send(outApi('500', 'Error in controller getAllFromTable', e));
    }
}

export default getOneFromTable;