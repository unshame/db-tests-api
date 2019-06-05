const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Test extends Sequelize.Model {
        static associate(Test, models) {
            Test.hasMany(models.Task, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                as: 'tasks',
                onDelete: 'CASCADE'
            });
        };
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
