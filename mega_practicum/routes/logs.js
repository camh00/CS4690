var express = require('express');
var router = express.Router();
DBWrapper = require('./db');
Log = require("../models/log");

const db = new DBWrapper();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log("GET /api/v1/logs");
  const logs = await db.getLogs();
  res.send(logs);
});

router.post('/', async (req, res) => {
  try {
    const { courseId, username, text } = req.body; // Use 'username' instead of 'logUsername'
    if (!courseId || !username || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLog = new Log({ courseId, username, text });
    await newLog.save();

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
