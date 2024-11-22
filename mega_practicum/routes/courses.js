var express = require('express');
var router = express.Router();
DBWrapper = require('./db');
Log = require("../models/courses");

const db = new DBWrapper();

/* GET courses listing. */
router.get('/', async function(req, res, next) {
  console.log("GET /api/v1/courses");
  const courses = await db.getCourses();
  res.send(courses);
});

router.post('/', async function(req, res, next) {
  console.log("courses/  POST " + req.body);
  const course = new Course({
    id: req.body.id,
    display: req.body.display
  });
  db.addCourse(course);

  res.send(JSON.stringify(course));
});

module.exports = router;
