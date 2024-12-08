var express = require('express');
var router = express.Router();
const isLoggedIn = require('../middleware/auth');
const path = require('path');

router.get('/', isLoggedIn, function(req, res, next) {
  if (req.user.school !== 'uofu') {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public', 'uofu.html'));
});

module.exports = router;