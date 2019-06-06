const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Sequelize.Model {
        static associate(models) {
            Task.belongsTo(models.Test, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                onDelete: 'CASCADE'
            });

            Task.hasMany(models.Answer, {
                foreignKey: {
                    allowNull: false,
                    name: 'taskId'
                },
                as: 'answers',
                onDelete: 'CASCADE'
            });
        };

        getParsedResult() {
            return JSON.parse(this.result);
        }

        getFormattedResult() {
            return JSON.stringify(JSON.parse(this.result), null, 4);
        }

        toJSON() {
            return {
                ...super.toJSON(), 
                formattedResult: this.getFormattedResult()
            };
        }

        toPublicJSON() {
            return {
                id: this.id,
                title: this.title
            };
        }
    }

    Task.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        query: {
            type: Sequelize.STRING,
            allowNull: false
        },
        result: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, { sequelize, timestamps: false });

    return Task;
};
