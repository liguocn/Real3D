/*jslint node: true */

var UserInfo = require("../models/UserInfo");

exports.login = function(req, res) {
    "use strict";
    console.log("user: ", req.params.username, req.session.user);
    UserInfo.findByName(req.params.username, function(err, obj) {
        if (obj) {
            if (req.session.user == req.params.username) {
                res.render("PersonalHomepage", {username: req.params.username});
            } else {
                res.redirect("/dologin");
            }
        } else {
            res.redirect("/doreg");
        }
    });
}
