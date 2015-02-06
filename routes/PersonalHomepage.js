/*jslint node: true */

var UserInfo = require("../models/UserInfo");

// exports.login = function(req, res) {
//     "use strict";
//     console.log("user: ", req.params.username, req.session.user);
//     UserInfo.findByName(req.params.username, function(err, obj) {
//         if (obj) {
//             if (req.session.user == req.params.username) {
//                 res.render("PersonalHomepage", {username: req.params.username});
//             } else {
//                 res.redirect("/dologin");
//             }
//         } else {
//             res.redirect("/doreg");
//         }
//     });
// }

exports.enter = function(req, res) {
    "use strict";
    console.log("    enter: ", req.session.user, " 's homepage");
    if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        UserInfo.findByName(req.session.user, function(err, obj) {
            if (obj) {
                console.log("   enter success");
                res.render("PersonalHomepage", {username: req.session.user});
            } else {
                console.log("  the user is not exist");
                res.redirect("/");
            }
        });
    }
};
