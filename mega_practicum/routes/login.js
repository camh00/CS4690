var express = require('express');
var router = express.Router();
const path = require('path');
const User = require('../models/user');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  });

router.post("/", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render('index', { title: 'Express' });
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
}

module.exports = router;
