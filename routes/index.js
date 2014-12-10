var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/doreg', function(req, res) {
  res.render('DoReg');
});

router.get('/dologin', function(req, res) {
  res.render('DoLogin');
});

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
