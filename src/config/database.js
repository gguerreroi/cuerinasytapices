const mssql = require('mssql')

let pool;

function getEncription() {
    let encription = process.env.DB_ENCRIPTION || 'false';
    if (encription === 'true' || encription === true) {
        return true;
    } else if (encription === 'false' || encription === false) {
        return false;
    } else {
        throw new Error("Invalid DB_ENCRIPTION value. It should be 'true' or 'false'.");
    }
}

async function connection(user, password, server) {
    let connPool;
    const {DB_NAME,  DB_PORT} = process.env;

    try {

        let encription = getEncription();


        if (user === undefined)
            throw {code: 500, message: "Db User is required"};

        if (password === undefined)
            throw {code: 501, message: "Db Password is required"};

        if (server === undefined)
            throw {code: 502, message: "Db Server is required"};

        const ConnectionString = {
            user: user,
            password: password,
            server: server,
            database: DB_NAME,
            port: Number(DB_PORT) || 1433,
            options: {
                encrypt: encription,
                enableArithAbort: true
            }
        }

        connPool = new mssql.ConnectionPool(ConnectionString)
        pool = await connPool.connect()
        pool.on("error", async function (e) {
            console.log("on pool error ", e)
            await close_pool()
        })
        return pool;
    } catch (e) {
        pool = null
        var message = e.message || e.originalError || e;
        if (e.code === undefined)
            console.error(e, typeof(e), e.message)
        return {
            code: 502,
            message: `${message}`
        }
    }
}

async function close_pool() {
    try {
        await pool.close()
        pool = null
    } catch (e) {
        pool = null
        console.log(e)
    }
}

export {connection, mssql}