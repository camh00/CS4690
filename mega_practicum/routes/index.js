var express = require('express');
var router = express.Router();
const path = require('path');
const isLoggedIn = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  console.log("routing to index.html");
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
