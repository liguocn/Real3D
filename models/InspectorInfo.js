var mongoose = require("./Mongodb");

var Schema = mongoose.Schema;

var InspectorInfoSchema = new Schema({
    designId : String,
    designName : String,
    creator: String
});

var InspectorInfoModel = mongoose.model("InspectorInfo", InspectorInfoSchema);

var InspectorInfoDAO = function() {
    "use strict";
};

InspectorInfoDAO.prototype.save = function(obj, callback) {
	"use strict";
	var inspectorInfoInstance = new InspectorInfoModel(obj);
	inspectorInfoInstance.save(function (err){
		callback(err);
	});
};

InspectorInfoDAO.prototype.findByDesignId = function (designId, callback) {
	"use strict";
	InspectorInfoModel.findOne({designId: designId}, function (err, obj) {
		callback(err, obj);
	});
};

InspectorInfoDAO.prototype.findByCreator = function (creator, callback) {
	"use strict";
	InspectorInfoDAO.find({creator: creator}, function (err, objs) {
		callback(err, objs);
	});
};

module.exports = new InspectorInfoDAO();