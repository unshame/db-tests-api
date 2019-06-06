const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Answer extends Sequelize.Model {
        static associate(models) {
            Answer.belongsTo(models.Attempt, {
                foreignKey: {
                    allowNull: false,
                    name: 'attemptId'
                },
                onDelete: 'CASCADE'
            });

            Answer.belongsTo(models.Test, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                }
            });

            Answer.belongsTo(models.Task, {
                foreignKey: {
                    allowNull: false,
                    name: 'taskId'
                }
            });

            Answer.belongsTo(models.Student, {
                foreignKey: {
                    allowNull: false,
                    name: 'studentId'
                }
            });
        };

        getFormattedResult() {
            return JSON.stringify(JSON.parse(this.result), null, 4);
        }

        toJSON() {
            return {
                ...super.toJSON(),
                formattedResult: this.getFormattedResult()
            };
        }
    }

    Answer.init({
        query: {
            type: Sequelize.STRING,
            allowNull: false
        },
        result: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        correct: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    }, { sequelize, timestamps: false });

    return Answer;
};
