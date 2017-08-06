var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
})

var User = mongoose.model('user', schema);


module.exports = { User }