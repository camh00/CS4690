var express = require('express');
var router = express.Router();
DBWrapper = require('../public/javascripts/db');
Log = require("../models/log");

// const db = new DBWrapper<Log>(); <= can only do with typescript
const db = new DBWrapper();

/* GET logs listing. */
// option 1, using await (preferred)
router.get('/', async function(req, res, next) {
  console.log("router.get::logs/  GET");

  logs = await db.getLogs();
  res.send(logs);
});

/* 
// option 2 using promise API
router.get('/', function(req, res, next) {
  console.log("router.get::logs/  GET");

  // without using await, since router.get that we're overloading isn't async 
  logsPromise = db.getLogs();
  logsPromise.then(logs => {
    console.log("router.get::logs:  " + logs);
    res.send(logs);
  }, err => {
    res.status = 500;
    console.log("router.get::err:  " + err);
    res.send([])
  });
});*/

router.post('/', async function(req, res, next) {
  console.log("logs/  POST " + req.body);
  const log = new Log(req.body.courseId, req.body.uvuId, req.body.text);

  await db.addLog(log);
  res.send(log);
});

router.delete('/', async function(req, res, next) {
  console.log("logs/  DELETE::body " + JSON.stringify(req.body));
  
  const _id = req.body._id;
  if (!_id)
  {
    res.status = 404;
    res.send({ err: "_id required in JSON body"});
    return null;
  }

  const result = await db.deleteLog(_id);
  resp = { result:  result };
  res.send(resp);
});

module.exports = router;
