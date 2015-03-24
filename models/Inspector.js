var mongoose = require("./Mongodb");

var Schema = mongoose.Schema;

var InspectorInfoSchema = new Schema({
    designId : String,
    designName : String,
    creator: String
});

var InspectorInfoModel = mongoose.model("Inspector", InspectorInfoSchema);

var InspectorInfoDAO = function() {
    "use strict";
};

module.exports = new InspectorInfoDAO();