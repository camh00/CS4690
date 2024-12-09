// module.exports = function(req, res, next) {
//     const school = req.headers['x-school']; // Example: using a custom header
//     if (!school) {
//       return res.status(400).json({ error: 'School is required' });
//     }
//     req.school = school;
//     next();
//   };