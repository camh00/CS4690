var express = require('express');
var router = express.Router();
DBWrapper = require('./db');
Log = require("../models/log");

const db = new DBWrapper();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("logs/  GET");
  const { courseId, uvuId } = req.query;
  let logs = db.getLogs();

  if (courseId) {
    logs = logs.filter(log => log.courseId === courseId);
  }

  if (uvuId) {
    logs = logs.filter(log => log.uvuId === uvuId);
  }

  res.send(logs);
});

router.post('/', function(req, res, next) {
  console.log("logs/  POST " + req.body);
  const log = new Log(req.body.courseId, req.body.uvuId, req.body.text);
  db.addLog(log);

  res.send(JSON.stringify(log));
});

module.exports = router;
