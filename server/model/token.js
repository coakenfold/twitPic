const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Token Schema
const Token = new Schema({
	"accessToken": String,
	"serviceId": String
});

module.exports = mongoose.model('tokens', Token);
