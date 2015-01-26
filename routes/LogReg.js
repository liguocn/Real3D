/*jslint node: true */

var UserInfo = require("../models/UserInfo");
var crypto = require("crypto");

exports.reg = function(req, res) {
    "use strict";
    res.render("DoReg");
};

exports.doReg = function(req, res) {
    "use strict";
    console.log("    doreg--username: ", req.body.username, "password: ", req.body.password);
    var md5 = crypto.createHash("md5");
    var password = md5.update(req.body.password).digest('base64');
    var newUserInfo = {
        userName: req.body.username,
        password: password
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
                    res.redirect("/users/" + req.body.username);
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
            var md5 = crypto.createHash("md5");
            var password = md5.update(req.body.password).digest('base64');
            if (obj.userName === req.body.username && obj.password === password) {
                req.session.user = req.body.username;
                res.redirect("/users/" + req.body.username);
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
