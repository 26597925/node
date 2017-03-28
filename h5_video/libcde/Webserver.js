var express = require("express");
var http = require("http");
var app = new express();
var server = http.createServer(app);
var path = require("path");
var webRTC = require('webrtc.io').listen(server);
var url = require('url');

var port = process.env.PORT || 20080;
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	return next();
});

// app.use("/src",express.static(path.resolve(__dirname,"src")));
// app.use("/",express.static(path.resolve(__dirname,"../../")));

app.use("/src", express.static(path.resolve(__dirname, "src")));
app.use("/", express.static(path.resolve(__dirname, "bin")));
app.use("/", express.static(path.resolve(__dirname, "../../")));
server.listen(port, function() {
	console.log("server on port :", port);
});