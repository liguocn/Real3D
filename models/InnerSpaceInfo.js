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
    creator: String,
    sceneData: {
        cameraOrthoPosition: [Number],
        userPointTree: {
            points: [userPointSchema]
        }
    }
});

var InnerSpaceInfoModel = mongoose.model("InnerSpaceInfo", InnerSpaceInfoSchema);

var InnerSpaceInfoDAO = function() {
    "use strict";
};

InnerSpaceInfoDAO.prototype.save = function(obj, callback) {
    "use strict";
    var innerSpaceInfoInstance = new InnerSpaceInfoModel(obj);
    innerSpaceInfoInstance.sava(function(err) {
        callback(err);
    });
};

InnerSpaceInfoDAO.prototype.findByDesignId = function(designId, callback) {
    "use strict";
    InnerSpaceInfoModel.findOne({designId: designId}, function(err, obj) {
        callback(err, obj);
    });
};

InnerSpaceInfoDAO.prototype.updateSceneData = function(designId, sceneData, callback) {
    "use strict";
    InnerSpaceInfoModel.update({designId: designId}, {sceneData: sceneData}, 
        function(err, numberAffected, rawResponse) {
            callback(err);
        });
};

module.exports = new InnerSpaceInfoDAO();
