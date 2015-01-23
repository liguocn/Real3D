//DB Connection
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:26688/real3d");
module.exports = mongoose;