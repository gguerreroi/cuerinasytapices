const Sequelize = require("sequelize");

const sequelizeSession  = new Sequelize({
    dialect: 'mssql',
    schema: 'envios',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 1433,
    dialectOptions: {
        options: {
            encrypt: process.env.DB_ENCRIPTION === 'true',
            enableArithAbort: true
        }
    }
})

export default sequelizeSession