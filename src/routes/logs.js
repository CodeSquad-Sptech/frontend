var express = require("express");
var router = express.Router();

var logsController = require("../controllers/logsController");

router.post("/log", function(req, res) {
    logsController.CriarLog(req, res)
});

module.exports = router;