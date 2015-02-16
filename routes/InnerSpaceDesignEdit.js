/*jslint plusplus: true */
/*jslint node: true */

var InnerSpaceInfo = require("../models/InnerSpaceInfo");

function generateDesignId(userName, designName) {
    "use strict";
    return "_" + userName + "_" + designName;
}

exports.enter = function (req, res) {
    "use strict";
    console.log("get innerspacedesign: ", req.query.designName);
    if (req.query.designName === '') {
        console.log("designName is space");
    }
    res.render('InnerSpaceDesignEdit', {designName: req.query.designName});
};

function unPackSceneData(body) {
    "use strict";
    var sceneData, userPointLen, curIndex, pid, userPoint, neiLen, nid;
    sceneData = {
        cameraOrthoPosition: [],
        wallThick: parseFloat(body.wallThick),
        wallHeight: parseFloat(body.wallHeight),
        userPointTree: {
            points: []
        }
    };
    sceneData.cameraOrthoPosition.push(parseFloat(body.cameraOrthoPosition[0]));
    sceneData.cameraOrthoPosition.push(parseFloat(body.cameraOrthoPosition[1]));
    sceneData.cameraOrthoPosition.push(parseFloat(body.cameraOrthoPosition[2]));
    userPointLen = parseInt(body.userPointLen, 10);
    curIndex = 0;
    for (pid = 0; pid < userPointLen; pid++) {
        userPoint = {
            posX: parseFloat(body.userPoints[curIndex]),
            posY: parseFloat(body.userPoints[curIndex + 1]),
            neighbors: []
        };
        neiLen = parseInt(body.userPoints[curIndex + 2], 10);
        curIndex += 3;
        for (nid = 0; nid < neiLen; nid++) {
            userPoint.neighbors.push(parseInt(body.userPoints[curIndex + nid], 10));
        }
        curIndex += neiLen;
        sceneData.userPointTree.points.push(userPoint);
    }
    return sceneData;
}

exports.save = function (req, res) {
    "use strict";
    var designId, sceneData, innerSpaceData;
    console.log("    --post innerspacedesign/save");
    if (req.session.user === undefined) {
        res.send({saved: -1});
        return;
    }
    res.set({"Content-Type": "application/json"});
    designId = generateDesignId(req.session.user, req.body.designName);
    console.log("    --designId: ", designId);
    InnerSpaceInfo.findByDesignId(designId, function (err, obj) {
        if (obj) {
            //update user data
            console.log("    --update user data");
            sceneData = unPackSceneData(req.body);
            InnerSpaceInfo.updateSceneData(designId, sceneData,
                function (err) {
                    if (err) {
                        console.log("error", err);
                        res.send({saved: 0});
                    } else {
                        res.send({saved: 1});
                    }
                });
        } else {
            if (err) {
                //error
                console.log("error: ", err);
                res.send({saved: 0});
            } else {
                //create a new record and save it
                console.log("    --create a new record and save it");
                sceneData = unPackSceneData(req.body);
                innerSpaceData = {
                    designId: designId,
                    designName: req.body.designName,
                    creator: req.session.user,
                    sceneData: sceneData
                };
                InnerSpaceInfo.save(innerSpaceData, function (err) {
                    if (err) {
                        //error
                        console.log("error: ", err);
                        res.send({saved: 0});
                    } else {
                        res.send({saved: 1});
                    }
                });
            }
        }
    });
};

exports.rename = function (req, res) {
    "use strict";
    var originDesignId, newDesignId;
    console.log("    --post innerspacedesign/rename");
    if (req.session.user === undefined) {
        res.send({success: -1});
        return;
    }
    res.set({"Content-Type": "application/json"});
    console.log(" data: ", req);
    newDesignId = generateDesignId(req.session.user, req.body.newDesignName);
    InnerSpaceInfo.findByDesignId(newDesignId, function (err, obj) {
        if (err) {
            console.log("    err: ", err);
            res.send({success: -1});
        } else if (obj) {
            console.log("    object exist, rename fail: ", req.body.originDesignName);
            res.send({success: 0});
        } else {
            originDesignId = generateDesignId(req.session.user, req.body.originDesignName);
            InnerSpaceInfo.updateDesignName(originDesignId,
                newDesignId, req.body.newDesignName, function (err) {
                    if (err) {
                        console.log("error", err);
                        res.send({success: -1});
                    } else {
                        res.send({success: 1});
                    }
                });
        }
    });
};

exports.load = function (req, res) {
    "use strict";
    var designId;
    console.log("    --post innerspacedesign/load");
    res.set({"Content-Type": "application/json"});
    designId = generateDesignId(req.session.user, req.body.designName);
    console.log("    --designId: ", designId);
    InnerSpaceInfo.findByDesignId(designId, function (err, obj) {
        if (err) {
            console.log("error: ", err);
            res.send({success: false});
        } else if (obj) {
            console.log("    find obj");
            res.send({success: true, sceneData: obj.sceneData});
        } else {
            console.log("    not find");
            res.send({success: false});
        }
    });
};

exports.findName = function (req, res) {
    "use strict";
    var designId;
    console.log("    --post innerspacedesign/load");
    res.set({"Content-Type": "application/json"});
    designId = generateDesignId(req.session.user, req.body.designName);
    console.log("    --designId: ", designId);
    InnerSpaceInfo.findByDesignId(designId, function (err, obj) {
        if (err) {
            console.log("error: ", err);
            res.send({success: false});
        } else if (obj) {
            res.send({success: true});
        } else {
            res.send({success: false});
        }
    });
};
