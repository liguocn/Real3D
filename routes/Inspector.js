var Inspector = require("../models/Inspector");

exports.enter = function (req, res) {
	"use strict";
	console.log("enter inspector");
	res.render("Inspector");
};