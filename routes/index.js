var express = require('express');
var router = express.Router();
var LogReg = require("./LogReg");
var InnerSpaceDesignEdit = require("./InnerSpaceDesignEdit");
var InnerSpaceDesign = require("./InnerSpaceDesign");
var PersonalHomePage = require("./PersonalHomePage");

/* GET home page. */
router.get("/", function(req, res) {
    "use strict";
    if (req.session.user !== undefined) {
        res.redirect("/personalhomepage");
    } else {
        res.render('index');
    }
});

router.get("/doreg", LogReg.reg);

router.post("/doreg", LogReg.doReg);

router.get("/dologin", LogReg.login);

router.post("/dologin", LogReg.doLogin);

router.post("/dologout", LogReg.doLogout);

router.get("/aboutus", function(req, res) {
    "use strict";
    res.render('AboutUs');
});

router.get("/personalhomepage", PersonalHomePage.enter);

router.get("/innerspacedesign", InnerSpaceDesign.enter);

router.get("/innerspacedesign/edit", InnerSpaceDesignEdit.enter);

router.post("/innerspacedesign/edit/save", InnerSpaceDesignEdit.save);

router.post("/innerspacedesign/edit/load", InnerSpaceDesignEdit.load);

router.post("/innerspacedesign/edit/rename", InnerSpaceDesignEdit.rename);

router.get("/furnituredesign", function(req, res) {
    "use strict";
    res.render('FurnitureDesign');
});

router.get("/designshow", function(req, res) {
    "use strict";
    res.render('DesignShow');
});

module.exports = router;
