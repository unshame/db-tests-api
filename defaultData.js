const models = require('./models');
const runTest = require('./runTest');

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

    const databaseName = "Quizzer";

    let test = await models.Test.create({
        "title": "Quizzer",
        "databaseName": databaseName
    });

    const query = 'SELECT * FROM Students';

    let task = await models.Task.create({
        testId: test.id,
        title: 'task 1',
        query: query,
        result: JSON.stringify(await runTest(databaseName, query)),
        isFinal: true
    });

    console.log(await models.Group.findAll());
    console.log(await models.Student.findAll());
    console.log(await models.Teacher.findAll());

})();
