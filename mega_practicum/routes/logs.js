var express = require('express');
var router = express.Router();
DBWrapper = require('./db');
Log = require("../models/log");

const db = new DBWrapper();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log("GET /api/v1/logs");
  const { courseId, username } = req.query;

  try {
    let query = {};
    if (courseId) {
      query.courseId = courseId;
    }
    if (username) {
      query.username = username;
    }

    const logs = await Log.find(query).exec();
    res.send(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { courseId, username, text } = req.body; // Use 'username' instead of 'logUsername'
    if (!courseId || !username || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLog = new Log({ courseId, username, text, date: new Date() });
    await newLog.save();

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
