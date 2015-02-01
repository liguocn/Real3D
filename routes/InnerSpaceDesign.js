/*jslint node: true */

var InnerSpaceInfo = require("../models/InnerSpaceInfo");

exports.enter = function(req, res) {
    "use strict";
    console.log("get innerspacedesign");
    res.render('InnerSpaceDesign');
};

exports.save = function(req, res) {
    "use strict";
    console.log("post innerspacedesign/save");
    res.set({"Content-Type": "application/json"});
    InnerSpaceInfo.findByDesignId(req.body.designedId, function(err, obj) {
        if (obj) {
            //update user data
            InnerSpaceInfo.update(req.body.designedId, req.body.sceneData,
                function(err) {
                    if (err) {
                        console.log("error", err);
                        res.send({saved: false});
                    } else {
                        res.send({saved: true});
                    }
                });
        } else {
            if (err) {
                //error
                console.log("error: ", err);
                res.send({saved: false});
            } else {
                //create a new record and save it
                InnerSpaceInfo.save(req.body, function(err) {
                    if (err) {
                        //error
                        console.log("error: ", err);
                        res.send({saved: false});
                    } else {
                        res.send({saved: true});
                    }
                });
            }
        }
    });
};

exports.load = function(req, res) {
    "use strict";
};
