const config = require("../config");
const initialize = require("./initialize");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const User = require("../model/user");
const Token = require("../model/token");

passport.use(new TwitterStrategy({
		consumerKey: config.twitter.consumerKey,
		consumerSecret: config.twitter.consumerSecret,
		callbackURL: config.url + "/authorize/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		// console.log('token:', token);
		// console.log('tokenSecret:', tokenSecret);
		// console.log('profile:', profile);

		Token.findOne({ "serviceId": profile.id}, function(err, tokenSaved) {
			if (err) { console.log(err); }
			// No saved token
			if (!tokenSaved) {
				tokenSaved = new Token({
					"accessToken": token,
					"serviceId": profile.id
				});
				tokenSaved.save(function(err) {
					if (err) {console.log(err); }
					console.log('TOKEN SAVED', tokenSaved);
				});
			} else {
				console.log('TOKEN EXISTS', tokenSaved);
				if (tokenSaved.accessToken !== token) {
					console.log('UPDATING EXISTING TOKEN TO', token);
					Token.update({"serviceId": profile.id}, {"accessToken": token}, function(err, affected) {
						console.log('affected rows', affected);
					});
				} else {
					console.log("NO NEED TO UPDATE EXISTING TOKEN");
				}
				
			}
		});

		User.findOne({ serviceId: profile.id }, function (err, user) {
			if (err) { return done(err); }
			// No user found
			if (!user) {
				console.log("CREATING USER");
				user = new User({
					"username": profile.username,
					"displayName": profile.displayName,
					"photos": profile.photos,
					"serviceId": profile.id
				});
				user.save(function(err){
					if (err) { console.log(err); }
					return done(err, user);
				});
			} else {
				// Found user, return
				console.log("RETURNING EXISTING USER");

				return done(err, user);
			}
		});
	}
));

initialize();

module.exports = passport;
