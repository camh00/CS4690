var express = require('express');
const DBWrapper = require('./db');
var router = express.Router();
const db = new DBWrapper();

/* GET user role. */
router.get('/role', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.json({ role: req.user.role });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

/* POST new user*/
router.post('/create', async function(req, res, next) {
  try {
    const { username, password, school, role } = req.body;
    const newUser = await db.createUser({ username, password, school, role });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;