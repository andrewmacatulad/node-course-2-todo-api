const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken');

const data = {
	id: 4
}

// https://jwt.io/

// it takes an object which is the data
// and a secret which in this case the 123
var token = jwt.sign(data, '123')
var decode = jwt.verify(token, '123');

console.log(decode)
console.log(token)
const message = "I am strong";

const hash = SHA256(message).toString();

console.log(hash)
console.log(message)

const data = {
	id: 4
}

var token = {
	data,
	// the 'somesecret' is the salt 
	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}
// the 'somesecret' is the salt 
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// this is sample if somebody will try to change the token but because there is not salt it will not work
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

if(resultHash === token.hash) {
	console.log('Data was not changed')
} else {
	console.log('Data was changed. Do not trust')
}