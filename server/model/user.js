const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User Schema
const User = new Schema({
	"username": String,
	"displayName": String,
	"photos": Array,
	"serviceId": String
});

module.exports = mongoose.model('users', User);
