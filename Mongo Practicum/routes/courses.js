var express = require('express');
var router = express.Router();
DBWrapper = require('./db');
Log = require("../models/courses");

const db = new DBWrapper();

/* GET courses listing. */
router.get('/', function(req, res, next) {
  console.log("GET /api/v1/courses");
  res.send(db.getCourses());
});


module.exports = router;
