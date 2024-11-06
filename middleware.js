module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Make sure it's req.originalUrl, not req.orginalUrl (typo)
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = "products"; // Default to a safe path if no redirect URL is set
    }
    next();
};
