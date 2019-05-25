const Sequelize = require('sequelize');
const env = process.env;

const sequelize = new Sequelize(env.DB_NAME, env.DB_LOGIN, env.DB_PASSWORD, {
    host: env.SERVER_HOST,
    dialect: 'mssql',
    requestTimeout: 30000,
    dialectOptions: {
        instanceName: env.SERVER_INSTANCE_NAME
    }
});

module.exports = sequelize;
