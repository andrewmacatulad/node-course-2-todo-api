const _ = require('lodash');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')

var schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		// unique verify property email if it is in used already
		unique: true,
		// custom validation
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 5
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
})

// this toJson will convert the generateAuthToken
// so it will be trimmed to what properties you want to display
// via pick which in this ase only _id and email are displayed
schema.methods.toJSON = function () {
	var user = this;
	// getting the mongoose variable user and converting it to a regular object
	// now you can use pick
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
}

// this is for a method that will generateAuthToken to be used in your server
schema.methods.generateAuthToken = function () {
	// to use this you must not use a regular function not an arrow function
	const user = this;
	const access = 'auth';
	// create a token using the jwt.sign which takes an id and convert it to string
	// and pass in the access which is auth
	// the test123 is the secret key
	// then toString it
	const token = jwt.sign({ _id: user._id.toHexString(), access}, 'test123').toString();

	// now add them to the token array
	// which you will pass the access which is auth
	// and token which the jwt.sign
	user.tokens.push({ access, token });

	// return the save and return the token inside of the save function
	return user.save().then(() => {
		return token;
	})
}


schema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'test123')
	} catch (e) {
		// return new Promise((resolve, reject) => {
		// 	reject();
		// })

		return Promise.reject()
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
}


schema.statics.findByCredentials = function (email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if(!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res) {
					resolve(user)
				} else {
					reject()
				}	
			})
				
		})

	})
}

schema.pre('save', function (next) {
	var user = this;
	
	if(user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				// since the user.password is still just plain at this point
				// set it to be the hashPassword
				user.password = hash;
				next();
			})
		})		
	} else {
		next();
	}
})


var User = mongoose.model('User', schema);


module.exports = { User }
