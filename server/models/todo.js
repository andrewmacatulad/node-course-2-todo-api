var mongoose = require('mongoose');

// save new something
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		// this is so it will error when you didn't input anything
		minlength: 1,
		// this is for whitespaces
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = {Todo};