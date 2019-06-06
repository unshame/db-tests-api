const router = require('express').Router();
const auth = require('../auth');
const models = require('../../models');
const runTest = require('../../runTest');

// get all tests
router.get('/', auth.required, async (req, res, next) => {
    return res.status(200).json(await models.Test.findAll().map(test => test.toJSON()));
});

// create new test
router.post('/', auth.teacher, async (req, res, next) => {
    const { body: { title, databaseName } } = req;

    let test;

    try {
        test = await models.Test.create({
            title, databaseName
        });
    } catch (err) {
        err.status = 400;
        return next(err);
    }

    return res.status(200).json(test.toJSON());
});

//get specific test
router.get('/:testId', auth.required, async (req, res, next) => {
    const { params: { testId } } = req;
    
    const test = await models.Test.findOne({
        where: { id: testId },
        include: [ { model: models.Task, as: 'tasks' } ]
    });

    if (!test) {
        return res.sendStatus(404);
    }
    
    return res.status(200).json(test.toJSON());
});

// delete test
router.delete('/:testId', auth.teacher, async (req, res, next) => {
    const { params: { testId } } = req;

    const deletedTest = await models.Test.destroy({
        where: { id: testId }
    });

    if (!deletedTest) {
        return res.sendStatus(404);
    }

    return res.sendStatus(204);
});

// get all tasks of test
router.get('/:testId/task', auth.required, async (req, res, next) => {
    const { params: { testId } } = req;

    const test = await models.Test.findOne({
        where: { id: testId },
        include: [{ model: models.Task, as: 'tasks' }]
    });

    if (!test) {
        return res.sendStatus(404);
    }

    return res.status(200).json(test.tasks);
});

router.get('/:testId/task/:taskId', auth.required, async (req, res, next) => {
    const { params: { taskId } } = req;

    const test = await models.Task.findOne({
        where: { id: taskId }
    });

    if (!test) {
        return res.sendStatus(404);
    }

    return res.status(200).json(test.toJSON());
});

router.post('/:testId/task', auth.teacher, async (req, res, next) => {
    const { 
        params: { testId },
        body: { title, query, isFinal } 
    } = req;

    const test = await models.Test.findOne({
        where: { id: testId }
    });

    if (!test) {
        return res.sendStatus(404);
    }

    let resultObject;

    try {
        resultObject = await runTest(test.databaseName, query);
    } catch (err) {
        return next(err);
    }

    const result = JSON.stringify(resultObject);

    if (!isFinal) {
        return res.status(200).json({
            result,
            formattedResult: JSON.stringify(resultObject, null, 4)
        });
    }

    let task;

    try {
        task = await models.Task.create({
            title, query, result, testId
        });
    } catch (err) {
        err.status = 400;
        return next(err);
    }

    return res.status(200).json(task.toJSON());
});

router.delete('/:testId/task/:taskId', auth.teacher, async (req, res, next) => {
    const { params: { taskId } } = req;

    const deletedTask = await models.Task.destroy({
        where: { id: taskId }
    });

    if (!deletedTask) {
        return res.sendStatus(404);
    }

    return res.status(204).send();
});

module.exports = router;
