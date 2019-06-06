const User = require('./abstracts/User');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Student extends User {
        getUserType() {
            return 'Student';
        }

        static associate(Student, models) {
            Student.belongsTo(models.Group, {
                foreignKey: {
                    allowNull: false,
                    name: 'groupId'
                },
                onDelete: 'CASCADE'
            });

            Student.hasMany(models.Attempt, {
                foreignKey: {
                    allowNull: false,
                    name: 'studentId'
                },
                as: 'attempts',
                onDelete: 'CASCADE'
            });

            Student.hasMany(models.Answer, {
                foreignKey: {
                    allowNull: false,
                    name: 'studentId'
                },
                as: 'answers'
            });
        };
    }

    Student.init({
        login: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {sequelize, timestamps: false });

    return Student;
};
