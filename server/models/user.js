var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	email: {
		required: true,
		trim: true,
		type: String,
		minlength: 1
	}
})

var User = ('user', schema);

module.exports = { User }