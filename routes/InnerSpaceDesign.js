/*jslint node: true */

var InnerSpaceInfo = require("../models/InnerSpaceInfo");

function generateDesignId(userName, designName) {
    "use strict";
    return "_" + userName + "_" + designName;
}

exports.enter = function(req, res) {
    "use strict";
    console.log("get innerspacedesign");
    res.render('InnerSpaceDesign');
};

exports.save = function(req, res) {
    "use strict";
    var designId, savedData;
    console.log("    --post innerspacedesign/save");
    res.set({"Content-Type": "application/json"});
    designId = generateDesignId(req.session.user, req.body.designName);
    console.log("    --designId: ", designId);
    console.log("    body: ", req.body);
    savedData = JSON.parse(req.body);
    if (req.body.sceneData === undefined) return;
    InnerSpaceInfo.findByDesignId(req.body.designedId, function(err, obj) {
        if (obj) {
            //update user data
            console.log("    --update user data");
            InnerSpaceInfo.update(designId, req.body.sceneData,
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
                console.log("    --create a new record and save it");
                console.log("    sceneData: ", req.body.sceneData);
                savedData = {
                    designId: designId,
                    designName: req.body.designName,
                    creator: req.session.user,
                    sceneData: req.body.sceneData
                };
                console.log("    savedData: ", savedData);
                InnerSpaceInfo.save(savedData, function(err) {
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
