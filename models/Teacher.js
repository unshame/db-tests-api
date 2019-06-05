const User = require('./abstracts/User');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Teacher extends User {
        getUserType() {
            return 'Teacher';
        }
    }

    Teacher.init({
        login: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        }
    }, {sequelize, timestamps: false });

    return Teacher;
};
