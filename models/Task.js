const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Sequelize.Model {
        static associate(Task, models) {
            Task.belongsTo(models.Test, {
                foreignKey: {
                    allowNull: false,
                    name: 'testId'
                },
                onDelete: 'CASCADE'
            });
        };

        getParsedAnswer() {
            return JSON.parse(this.answer);
        }

        getFormattedAnswer() {
            return JSON.stringify(JSON.parse(this.answer), null, 4);
        }

        toJSON() {
            return {
                ...super.toJSON(), 
                formattedAnswer: this.getFormattedAnswer()
            };
        }
    }

    Task.init({
        title: {
            type: Sequelize.STRING
        },
        answer: {
            type: Sequelize.TEXT
        }
    }, { sequelize, timestamps: false });

    return Task;
};
