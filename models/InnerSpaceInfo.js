/*jslint node: true */

var mongoose = require("./Mongodb");

var Schema = mongoose.Schema;

var userPointSchema = new Schema({
    posX: Number,
    posY: Number,
    neighbors: [Number]
});

var InnerSpaceInfoSchema = new Schema({
    designId: String,
    designName: String,
    creator: String,
    sceneData: {
        cameraOrthoPosition: [Number],
        cameraPerspPosition: [Number],
        wallThick: Number,
        wallHeight: Number,
        userPointTree: {
            points: [userPointSchema]
        }
    }
});

var InnerSpaceInfoModel = mongoose.model("InnerSpaceInfo", InnerSpaceInfoSchema);

var InnerSpaceInfoDAO = function () {
    "use strict";
};

InnerSpaceInfoDAO.prototype.save = function (obj, callback) {
    "use strict";
    var innerSpaceInfoInstance = new InnerSpaceInfoModel(obj);
    innerSpaceInfoInstance.save(function (err) {
        callback(err);
    });
};

InnerSpaceInfoDAO.prototype.findByDesignId = function (designId, callback) {
    "use strict";
    InnerSpaceInfoModel.findOne({designId: designId}, function (err, obj) {
        callback(err, obj);
    });
};

InnerSpaceInfoDAO.prototype.findByCreator = function (creator, callback) {
    "use strict";
    InnerSpaceInfoModel.find({creator: creator}, function (err, objs) {
        callback(err, objs);
    });
};

InnerSpaceInfoDAO.prototype.updateSceneData = function (designId, sceneData, callback) {
    "use strict";
    InnerSpaceInfoModel.update({designId: designId}, {sceneData: sceneData},
        function (err, numberAffected, rawResponse) {
            callback(err);
        });
};

InnerSpaceInfoDAO.prototype.updateDesignName = function (designId, newDesignId, newDesignName, callback) {
    "use strict";
    InnerSpaceInfoModel.update({designId: designId}, {designId: newDesignId, designName: newDesignName},
        function(err, numberAffected, rawResponse) {
            callback(err);
        });
};

module.exports = new InnerSpaceInfoDAO();
