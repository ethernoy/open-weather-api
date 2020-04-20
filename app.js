require("dotenv").config();
var express = require("express");
var path = require("path");
var expressjwt = require("express-jwt");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var tokenRouter = require("./routes/token");
var weatherRouter = require("./routes/weather");

var app = express();

app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(expressjwt({ secret: process.env.JWT_SECRET || "just_a_secret"}).unless({path: ["/token"]}));

app.use(function (err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		res.status(401).send("Invalid token");
	}
});

app.use("/", indexRouter);
app.use("/weather", weatherRouter);
app.use("/token", tokenRouter);

module.exports = app;
