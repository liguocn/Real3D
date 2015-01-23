/*jslint node: true */

var mongoose = require("./Mongodb");

var Schema = mongoose.Schema;

var UserInfoSchema = new Schema({
    userName: String,
    password: String
});

var UserInfoModel = mongoose.model("UserInfo", UserInfoSchema);

var UserInfoDAO = function() {
    "use strict";
};

UserInfoDAO.prototype.save = function(obj, callback) {
    "use strict";
    var userInfoInstance = new UserInfoModel(obj);
    userInfoInstance.save(function(err) {
        callback(err);
    });
};

UserInfoDAO.prototype.findByName = function(name, callback) {
    "use strict";
    UserInfoModel.findOne({userName: name}, function(err, obj) {
        callback(err, obj);
    });
};

module.exports = new UserInfoDAO();
