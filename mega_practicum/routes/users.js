var express = require('express');
var router = express.Router();

/* GET user role. */
router.get('/role', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.json({ role: req.user.role });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;