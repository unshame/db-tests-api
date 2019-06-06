const Sequelize = require('sequelize');
const models = require('./index');

module.exports = (sequelize, DataTypes) => {
    class Attempt extends Sequelize.Model {
        static associate(models) {
            Attempt.belongsTo(models.Student, {
                foreignKey: {
                    allowNull: false,
                    name: 'studentId'
                },
                onDelete: 'CASCADE'
            });

            Attempt.belongsTo(models.Test, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                onDelete: 'CASCADE'
            });

            Attempt.hasMany(models.Answer, {
                foreignKey: {
                    allowNull: false,
                    name: 'attemptId'
                },
                as: 'answers',
                onDelete: 'CASCADE'
            });
        };

        async getProgress() {
            const test = await this.getTest();
            const tasks = await test.getTasks({
                include: [{
                    model: models.Answer,
                    as: 'answers',
                    required: false,
                    where: {
                        studentId: this.studentId
                    }
                }]
            });

            return {
                ...this.toJSON(),
                test: test.toPublicJSON(),
                tasks: tasks.map((task) => {
                    return {
                        ...task.toPublicJSON(),
                        answer: task.answers[0]
                    };
                })
            };
        }
    }

    Attempt.init({
        date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        finished: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, { sequelize, timestamps: false });

    return Attempt;
};
