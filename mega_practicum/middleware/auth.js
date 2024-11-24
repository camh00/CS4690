function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated");
        return next();
    }
    console.log("User is not authenticated");
    res.redirect('/login');
}

module.exports = isLoggedIn;