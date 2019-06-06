const Sequelize = require('sequelize');
const env = process.env;

const connections = new Map();

async function runTest(databaseName, query) {

    if (typeof query !== 'string') {
        const error = new Error(`No query provided`);
        error.status = 400;
        throw error;
    }

    const connection = getConnection(databaseName);
    
    let transaction;

    try {
        transaction = await connection.transaction();
    } catch (err) {
        const error = new Error(`Couldn't start a transaction`);
        error.status = 500;
        throw error;
    }

    let results, error;

    try {
        [results] = await connection.query(query, { transaction });
    } catch (err) {
        error = new Error(err.message);
        error.status = 400;
    }

    await transaction.rollback();

    if (error) {
        throw error;
    }

    return results;
}

function getConnection(databaseName) {

    if (!connections.has(databaseName)) {

        const connection = new Sequelize(databaseName, env.DB_TEST_LOGIN, env.DB_TEST_PASSWORD, {
            host: env.TEST_SERVER_HOST,
            dialect: 'mssql',
            requestTimeout: 30000,
            dialectOptions: {
                instanceName: env.TEST_SERVER_INSTANCE_NAME
            }
        });

        connections.set(databaseName, connection);
        return connection;
    }

    return connections.get(databaseName);
}

module.exports = runTest;
