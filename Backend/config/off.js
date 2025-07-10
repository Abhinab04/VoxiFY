module.exports = {
    ensureAuthentication: function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log(req.user)
            return next()
        }
        else {
            return res.json({ success: 'false', msg: "redirect to login" })
        }
    }
}