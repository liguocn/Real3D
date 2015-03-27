var Inspector = require("../models/InspectorInfo");

exports.enter = function (req, res) {
	"use strict";
	console.log("enter inspector");
	res.render("Inspector");
};