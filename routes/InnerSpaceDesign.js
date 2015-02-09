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
        res.send({success: false});
    } else {
        InnerSpaceInfo.findByCreator(req.session.user, function (err, objs) {
            if (err) {
                res.send({success: false});
            } else if (objs) {
                designItems = {
                    success: true,
                    designNames: [],
                    designIds: []
                };
                objLen = objs.length;
                for (objId = 0; objId < objLen; objId++) {
                    designItems.designNames.push(objs[objId].designName);
                    designItems.designIds.push(objs[objId].designId);
                }
                res.send(designItems);
            } else {
                res.send({success: false});
            }
        });
    }
};
