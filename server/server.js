const config = require("./config");
const port = config.port;

const mongoose = require("mongoose");
const passport = require("passport");
const passportTwitter = require("./authorize/twitter");
const path = require("path");


mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on("error", function(){
  console.log("Error: Could not connect to MongoDb. Did you forget to run `mongod`?");
});

//db.db.dropCollection('users', function(err, result) {
//	console.log('result', result); 
//	console.log('err', err);
//});
//db.db.dropCollection('tokens', function(err, result) {
//	console.log('result', result); 
//	console.log('err', err);
//});


// Express
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");

const app = express();
//app.engine("html");
//app.set("view engine", "html");
app.use("/public", express.static(path.join("..", "public")));
app.use(bodyParser.json()); // parses body of request as json and sticks it it in the req.body property
app.use(bodyParser.urlencoded({extended: false})); // parses url-encoded data and attaches to req.body as string or arrays
app.use(session({"secret": config.sessionSecret, resave: false, saveUninitialized: false})); //?
app.use(passport.initialize());
app.use(passport.session());

// Error Handlers
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({"message": err.name + ": " + err.message});
  }
});

app.listen(port, function() {
  console.log("Site at:", config.url);
});

app.get("/", function(req, res) {
  res.sendFile("index.html", {root: "public"});
});

app.get("/login", function(req, res) {
  res.sendFile("login.html", {root: "public"});
});

app.get("/authorize/twitter", passport.authenticate("twitter"));

app.get('/authorize/twitter/callback',
	passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
	function(req, res) {
		// Successful authentication
		res.json(req.user);
	}
);
