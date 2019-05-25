const User = require('./User');
const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');

class Teacher extends User {
    constructor(...args) {
        super(...args);
        this.idKey = 'idTeacher';
    }

    getUserType() {
        return 'Teacher';
    }

    static getUserIdKey() {
        return 'idTeacher';
    }
}

Teacher.dataTypes = Object.assign({}, User.dataTypes, {
    idTeacher: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }
});

Teacher.options = {
    sequelize,
    timestamps: false,
    modelName: 'Teacher'
};

Teacher.init(Teacher.dataTypes, Teacher.options);

module.exports = Teacher;
