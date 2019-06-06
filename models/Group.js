const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Group extends Sequelize.Model {
        static associate(models) {
            Group.hasMany(models.Student, {
                foreignKey: {
                    allowNull: false,
                    name: 'groupId'
                },
                as: 'students',
                onDelete: 'CASCADE'
            });
        };
    }

    Group.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        year: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {sequelize, timestamps: false });

    return Group;
};
