/*jslint node: true */

var InnerSpaceInfo = require("../models/InnerSpaceInfo");

exports.enter = function (req, res) {
    "use strict";
    console.log("enter innerspacedesign");
    res.render("InnerSpaceDesign");
};

exports.getItems = function (req, res) {
    "use strict";
    console.log("getItems...");
    var designItems, objId, objLen;
    res.set({"Content-Type": "application/json"});
    if (req.session.user === undefined) {
        console.log("user is undefined");
        res.send({success: false});
    } else {
        InnerSpaceInfo.findByCreator(req.session.user, function (err, objs) {
            if (err) {
                console.log("error: ", err);
                res.send({success: false});
            } else if (objs) {
                designItems = {
                    success: true,
                    designNames: []
                };
                objLen = objs.length;
                for (objId = 0; objId < objLen; objId++) {
                    designItems.designNames.push(objs[objId].designName);
                }
                console.log("find items: ", objLen);
                res.send(designItems);
            } else {
                console.log("not find");
                res.send({success: false});
            }
        });
    }
};
