var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

/* GET token. */
router.get("/", function(_, res) {
	var token = jwt.sign({}, process.env.JWT_SECRET || "just_a_secret", {
		expiresIn: 3600
	});
	res.send(token);
});

module.exports = router;
