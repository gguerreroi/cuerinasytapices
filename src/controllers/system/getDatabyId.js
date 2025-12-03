import {connection, mssql} from "../../config/database"
import {get_credentials} from "../../utils/get-credentials";
import outApi from "../../utils/out-api";
const {DB_HOST} = process.env;

async function getDataById(req, view, column, id) {
    const {Username, Database, Password} = get_credentials(req);
    let whr = `${column} = ${id}`;
    let Connection = null
    try{
        Connection = await connection(Username, Password, `${DB_HOST}`, Database);
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        let sql = `SELECT * FROM ${view} WHERE ${whr}`;
        return stmt.query(sql);
    }catch(e){
        console.log('err in query getDataById', e);
        return outApi('500', 'Error in controller getDataById', e);
    }
}

export default getDataById;