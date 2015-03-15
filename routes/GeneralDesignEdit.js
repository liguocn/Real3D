exports.enter = function (req, res) {
    "use strict";
    console.log("get generaldesignedit: ", req.query.designName);
    if (req.query.designName === '') {
        console.log("designName is space");
    }
    res.render('GeneralDesignEdit', {designName: req.query.designName});
};
