const models = require('./models');

(async () => {
    let group = await models.Group.create({
        title: 'Test'
    });

    group = await models.Group.create({
        title: 'Test 1'
    });

    let student = await models.Student.create({
        login: 'unshame',
        name: 'UnShame',
        password: '1234',
        groupId: group.id
    });

    let teacher = await models.Teacher.create({
        login: 'teacher',
        name: 'Teacher',
        password: '1234'
    });

    console.log(await models.Group.findAll());
    console.log(await models.Student.findAll());
    console.log(await models.Teacher.findAll());

    require('./runTest')('Quizzer', `UPDATE Students SET login = "asdasd" WHERE login = "unshame"`)
        .catch(err => {
            console.log(err);
        })
        .then(results => {
            console.log(results);
        });
})();
