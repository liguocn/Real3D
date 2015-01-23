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
    res.render('InnerSpaceDesign');
});

router.get('/furnituredesign', function(req, res) {
    res.render('FurnitureDesign');
});

router.get('/designshow', function(req, res) {
    res.render('DesignShow');
});

module.exports = router;
