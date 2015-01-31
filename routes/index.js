var express = require('express');
var router = express.Router();
var LogReg = require("./LogReg");

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get("/doreg", LogReg.reg);

router.post('/doreg', LogReg.doReg);

router.get('/dologin', LogReg.login);

router.post("/dologin", LogReg.doLogin);

router.get('/aboutus', function(req, res) {
    res.render('AboutUs');
});

router.get('/innerspacedesign', function(req, res) {
    console.log("get innerspacedesign");
    res.render('InnerSpaceDesign');
});

router.post('/innerspacedesign/save', function(req, res) {
    console.log("post innerspacedesign/save");
    console.log("stateId:", req.body.stateId, " pointCount: ", req.body.pointCount);
    console.log("ContentType: ", res.ContentType);
    res.set({"Content-Type": "application/json"});
    res.send({serverId: "serverId12", serverCount: 12});
});

router.get('/furnituredesign', function(req, res) {
    res.render('FurnitureDesign');
});

router.get('/designshow', function(req, res) {
    res.render('DesignShow');
});

module.exports = router;
