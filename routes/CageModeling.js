exports.enter = function (req, res) {
    "use strict";
    console.log("get cage modeling: ", req.query.designName);
    if (req.query.designName === '') {
        console.log("designName is space");
    }
    res.render('CageModeling', {designName: req.query.designName});
};
