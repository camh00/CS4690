const path = require('path');

module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
  
    next();
  };