
const User = require('./User');
const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');

class Student extends User {
    constructor(...args) {
        super(...args);
        this.idKey = 'idStudent';
    }

    getUserType() {
        return 'Student';
    }

    static getUserIdKey() {
        return 'idStudent';
    }
}

Student.dataTypes = Object.assign({}, User.dataTypes, {
    idStudent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    idGroup: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    credited: {
        type: Sequelize.STRING
    }
});

Student.options = {
    sequelize,
    timestamps: false,
    modelName: 'Student'
};

Student.init(Student.dataTypes, Student.options);

module.exports = Student;
