"use strict"
import {connection, mssql} from "../../config/database"
import {get_credentials} from "../../utils/get-credentials";
import outApi from "../../utils/out-api";


const {DB_HOST} = process.env;

async function updateTableById(request, response) {
    const {Username, Database, Password} = get_credentials(request);
    const {table, column, id} = request.params;
    const {colname, colvalue} = request.body;

    let strupdate = "";
    let cols = colname.split(",");
    let values = colvalue.split(",");
    if (cols.length > 1 ){
        cols.map(function(value, index, array){
            strupdate += `${value}='${values[index]}',`
        })
        strupdate = strupdate.slice(0, -1)
    } else {
        strupdate = `${colname}='${colvalue}'`;
    }

    let Connection = null;
    try{
        Connection = await connection(Username, Password, `${DB_HOST}`, `${Database}`);
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message};
        const stmt = await Connection.request()

        let sql = `UPDATE ${table} SET ${strupdate} WHERE ${column}='${id}'`
        stmt.query(sql, function(err, result){
            if (err){
                response.status(500).send(outApi('500',`Error in query, ${err.message}`, err))
            }else{
                response.status(200).send(outApi('200','Actualizacion Exitosa', result))
            }
        })

    }catch(e){
        response.status(500).send(outApi('500','General error ' + e.message, e ))
    }
}

export default updateTableById;