var express = require('express');
var router = express.Router();
var PersonalHomepage = require("./PersonalHomepage");

/* GET users listing. */
router.get('/:username', PersonalHomepage.login);

module.exports = router;
