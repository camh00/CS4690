const path = require('path');

module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
  
    // const userSchool = req.user.school;
    // const requestedPath = req.path;
  
    // if (userSchool === 'uvu' && !requestedPath.startsWith('/uvu')) {
    //   return res.redirect('/uvu');
    // }
  
    // if (userSchool === 'uofu' && !requestedPath.startsWith('/uofu')) {
    //   return res.redirect('/uofu');
    // }
  
    next();
  };