var express = require('express');
const DBWrapper = require('./db');
var router = express.Router();
const db = new DBWrapper();
const isLoggedIn = require('../middleware/auth');

/* GET user role. */
router.get('/role', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.json({ role: req.user.role });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

/* GET users based on role*/
router.get('/', isLoggedIn, async function(req, res, next) {
  console.log("GET /users");
  try {
    let users;
    if (req.user.role === 2) { // Teacher
      users = await db.getAllStudents();
    } else {
      users = await db.getAllUsers();
    }
    res.send(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET current user */
router.get('/me', isLoggedIn, function(req, res, next) {
  res.json(req.user);
});

/* POST new user*/
router.post('/create', isLoggedIn, async function(req, res, next) {
  try {
    const { username, password, school, role } = req.body;

    // If the logged-in user is a teacher, they can only create students
    if (req.user.role === 2 && role !== 3) {
      return res.status(403).json({ error: 'Teachers can only create students' });
    }

    const newUser = await db.createUser({ username, password, school, role });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;