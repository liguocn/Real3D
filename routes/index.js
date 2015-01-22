var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get("/doreg", function(req, res) {
    res.render("DoReg");
})

router.post('/doreg', function(req, res) {
    console.log("    doreg--username: ", req.body["username"], "session: ", req.session.user);
    req.session.user = req.body["username"];
    res.redirect("/innerspacedesign");
});

router.get('/dologin', function(req, res) {
    res.render('DoLogin');
});

router.post("/doLogin", function(req, res) {
    console.log("    doLogin--username: ", req.body["username"], "session: ", req.session.user);
    if (req.session.user === req.body["username"]) {
        res.redirect("/innerspacedesign");
    } else {
        res.redirect("/doreg");
    }
})

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
