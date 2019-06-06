const router = require('express').Router();
const auth = require('../auth');
const models = require('../../models');
const runTest = require('../../runTest');

router.get('/', auth.teacher, async (req, res, next) => {
    return res.status(200).json(await models.Attempt.findAll().map(attempt => attempt.toJSON()));
});

// start new attempt
router.post('/', auth.student, async (req, res, next) => {
    const { 
        body: { testId },
        payload: { id: studentId }
    } = req;

    if (await models.Attempt.findOne({
        where: { id: testId, studentId }
    })) {
        return res.sendStatus(409);
    }

    const test = await models.Test.findOne({
        where: { id: testId }
    });


    if (!test) {
        return res.sendStatus(404);
    }

    let attempt;

    try {
        attempt = await models.Attempt.create({
            testId, studentId
        });
    } catch (err) {
        err.status = 400;
        return next(err);
    }
    
    return res.status(200).json(await attempt.getProgress());
});

router.get('/:attemptId', auth.student, async (req, res, next) => {
    const { 
        params: { attemptId },
        payload: {id: studentId }
    } = req;

    const attempt = await models.Attempt.findOne({
        where: { id: attemptId, studentId }
    });

    if (!attempt) {
        return res.sendStatus(404);
    }

    return res.status(200).json(await attempt.getProgress());
});

router.post('/:attemptId/task/:taskId', auth.student, async (req, res, next) => {
    const {
        params: { attemptId, taskId },
        body: { query, isFinal },
        payload: { id: studentId }
    } = req;

    const attempt = await models.Attempt.findOne({
        where: { id: attemptId, studentId, finished: false }
    });

    if (!attempt) {
        return res.sendStatus(404);
    }

    const test = await models.Test.findOne({
        where: { id: attempt.testId }
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
            formattedAnswer: JSON.stringify(resultObject, null, 4)
        });
    }

    const task = await models.Task.findOne({
        where: { id: taskId }
    });

    if (!task) {
        return res.sendStatus(404);
    }

    let answer;

    try {
        answer = await models.Answer.create({
            studentId,
            testId: test.id,
            taskId,
            attemptId: attempt.id, 
            query, 
            result,
            correct: task.result === result
        });
    } catch (err) {
        err.status = 400;
        return next(err);
    }

    return res.status(200).json(answer.toJSON());
});

router.post('/:attemptId/finish', auth.student, async (req, res, next) => {
    const {
        params: { attemptId },
        payload: { id: studentId }
    } = req;

    const attempt = await models.Attempt.findOne({
        where: { id: attemptId, studentId, finished: false }
    });

    if (!attempt) {
        return res.sendStatus(404);
    }

    await attempt.update({
        finished: true
    });

    return res.status(200).json(await attempt.getProgress());
});

module.exports = router;
