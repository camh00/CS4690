var express = require('express');
const DBWrapper = require('./db');
var router = express.Router();
const db = new DBWrapper();

/* Enroll user in course */
router.post('/', async function(req, res, next) {
try {
    const { username, courseDisplay } = req.body;
    if (typeof username !== 'string' || typeof courseDisplay !== 'string') {
        console.log(typeof username);
        console.log(typeof courseDisplay);
        throw new Error('Invalid input');
    }
    const result = await db.enrollUserInCourse(username, courseDisplay);
    res.status(200).json({ message: 'User enrolled successfully', result });
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
});

module.exports = router;