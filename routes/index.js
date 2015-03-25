var express = require('express');
var router = express.Router();
var LogReg = require("./LogReg");
var InnerSpaceDesignEdit = require("./InnerSpaceDesignEdit");
var InnerSpaceDesign = require("./InnerSpaceDesign");
var PersonalHomePage = require("./PersonalHomePage");
var GeneralDesign = require("./GeneralDesign");
var GeneralDesignEdit = require("./GeneralDesignEdit");
var Inspector = require("./Inspector");
var CageModeling = require("./CageModeling");

/* GET home page. */
router.get("/", function (req, res) {
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

router.get("/aboutus", function (req, res) {
    "use strict";
    res.render('AboutUs');
});

router.get("/personalhomepage", PersonalHomePage.enter);

router.get("/innerspacedesign", InnerSpaceDesign.enter);

router.get("/innerspacedesign/getitems", InnerSpaceDesign.getItems);

router.get("/innerspacedesign/edit", InnerSpaceDesignEdit.enter);

router.post("/innerspacedesign/edit/save", InnerSpaceDesignEdit.save);

router.post("/innerspacedesign/edit/load", InnerSpaceDesignEdit.load);

router.post("/innerspacedesign/edit/rename", InnerSpaceDesignEdit.rename);

router.get("/innerspacedesign/edit/findName", InnerSpaceDesignEdit.findName);

router.get("/generaldesign", GeneralDesign.enter);

router.get("/generaldesign/edit", GeneralDesignEdit.enter);

router.get("/cagemodeling", CageModeling.enter);

router.get("/furnituredesign", function(req, res) {
    "use strict";
    res.render('FurnitureDesign');
});

router.get("/designshow", function (req, res) {
    "use strict";
    res.render('DesignShow');
});

router.get("/inspector", Inspector.enter);

module.exports = router;
