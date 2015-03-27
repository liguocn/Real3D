exports.enter = function (req, res) {
	"use strict";
	console.log("get inspectorEdit: ", req.query.designName);
	if (req.query.designName === '') {
		console.log("designName is empty");
	}
	res.render('InspectorEdit', {designName: req.query.designName});
};