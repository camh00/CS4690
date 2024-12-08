var express = require('express');
var router = express.Router();
const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  });

// router.post("/", async function(req, res){
//     try {
//         // check if the user exists
//         const user = await User.findOne({ username: req.body.username });
//         if (user) {
//           //check if password matches
//           const result = req.body.password === user.password;
//           if (result) {
//             res.render('index', { title: 'Express' });
//           } else {
//             res.status(400).json({ error: "password doesn't match" });
//           }
//         } else {
//           res.status(400).json({ error: "User doesn't exist" });
//         }
//       } catch (error) {
//         res.status(400).json({ error });
//       }
// });

/* POST login data. */
// router.post('/', async function(req, res, next) { // Add `next` as an argument
//   try {
//     // Check if the user exists
//     const user = await User.findOne({ username: req.body.username });
//     if (user) {
//       // Check if password matches
//       const result = await bcrypt.compare(req.body.password, user.password);
//       if (result) {
//         req.login(user, function(err) {
//           if (err) {
//             return next(err); // Use `next` to pass the error to the error handler
//           }
//           return res.redirect('/');
//         });
//       } else {
//         res.status(400).json({ error: "Password doesn't match" });
//       }
//     } else {
//       res.status(400).json({ error: "User doesn't exist" });
//     }
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// });

router.post('/', async function(req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          if (user.school === 'uvu') {
            return res.redirect('/uvu');
          } else if (user.school === 'uofu') {
            return res.redirect('/uofu');
          }
        });
      } else {
        res.status(400).json({ error: "Password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
