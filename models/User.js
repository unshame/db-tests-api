const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

class User extends Sequelize.Model {

    validatePassword(password) {
        return this.password === password;
    }

    generateJWT() {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            id: this[this.idKey],
            type: this.getUserType(),
            login: this.login,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, 'secret');
    }

    toAuthJSON() {
        return {
            id: this[this.idKey],
            type: this.getUserType(),
            login: this.login,
            token: this.generateJWT(),
        };
    }

    getUserType() {
        return 'User';
    }

    static getUserIdKey() {
        return 'idUser';
    }

}

User.dataTypes = {
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING
    },
    middleName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
};

module.exports = User;
