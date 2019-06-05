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
            id: this.id,
            type: this.getUserType(),
            login: this.login,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, 'secret');
    }

    toAuthJSON() {
        return {
            id: this.id,
            type: this.getUserType(),
            login: this.login,
            token: this.generateJWT(),
        };
    }

    getUserType() {
        return 'User';
    }

}

module.exports = User;
