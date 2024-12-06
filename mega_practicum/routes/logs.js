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

router.post('/', async function(req, res, next) {
  console.log("logs/  POST " + req.body);
  const log = new Log(req.body.courseId, req.body.username, req.body.text);
  db.addLog(log);

  res.send(JSON.stringify(log));
});

module.exports = router;
