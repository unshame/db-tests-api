const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Test extends Sequelize.Model {
        static associate(models) {
            Test.hasMany(models.Task, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                as: 'tasks',
                onDelete: 'CASCADE'
            });

            Test.hasMany(models.Attempt, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                as: 'attempts',
                onDelete: 'CASCADE'
            });

            Test.hasMany(models.Answer, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                as: 'answers'
            });
        };

        toPublicJSON() {
            const value = this.toJSON();
            delete value.databaseName;
            return value;
        }
    }

    Test.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        databaseName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {sequelize, timestamps: false });

    return Test;
};
