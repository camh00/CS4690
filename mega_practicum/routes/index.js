var express = require('express');
var router = express.Router();
const path = require('path'); // Import the path module
const isLoggedIn = require('../middleware/auth');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET home page. */
// router.get('/', isLoggedIn, function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', isLoggedIn, function(req, res, next) {
  console.log("routing to index.html");
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
