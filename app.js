const models = require('./models');

models.sequelize.sync({ force: true }).then(() => {
    require('./defaultData');
    require('./express');
});
