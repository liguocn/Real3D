/*jslint node: true */

var UserInfo = require("../models/UserInfo");

exports.reg = function(req, res) {
    "use strict";
    res.render("DoReg");
};

exports.doReg = function(req, res) {
    "use strict";
    console.log("    doreg--username: ", req.body.username, "password: ", req.body.password);
    var newUserInfo = {
        userName: req.body.username,
        password: req.body.password
    };
    UserInfo.findByName(req.body.username, function(err, obj) {
        if (obj) {
            console.log("    user alreay exists: ", obj);
        } else {
            UserInfo.save(newUserInfo, function(err) {
                if (err) {
                    console.log("    error: ", err);
                    res.redirect("/doreg");
                } else {
                    req.session.user = req.body.username;
                    res.redirect("/innerspacedesign");
                }
            });
        }
    });
};

exports.login = function(req, res) {
    "use strict";
    res.render('DoLogin');
};

exports.doLogin = function(req, res) {
    "use strict";
    console.log("    doLogin--username: ", req.body.username, "session: ", req.session.user);
    UserInfo.findByName(req.body.username, function(err, obj) {
        if (obj) {
            if (obj.userName === req.body.username && obj.password === req.body.password) {
                res.redirect("/innerspacedesign");
            } else {
                console.log("    error: wrong password");
                res.redirect("/dologin");
            }
        } else {
            console.log("    error: no user exists");
            res.redirect("/dologin");
        }
    });
};
