'use strict';

const path = require('path');
var router = require("express").Router();

const logger = require('../config/logger').logger;

// logger.info(path.basename(module.filename));

router.route("/")
    .get(function(req, res) {
        res.send('Hello World from ' + path.basename(module.filename));
    });

module.exports = router;