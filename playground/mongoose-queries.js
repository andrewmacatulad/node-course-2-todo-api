const { ObjectID } = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '5986f3b8d589041bc8ff7fc61';

// Validating ID
// if(!ObjectID.isValid(id)) {
// 	console.log('id is not valid')
// }

// Todo.find({
// 	_id: id
// }).then((results) => {
// 	console.log('Todos ', results)
// });

// // will only grabe the first one
// Todo.findOne({
// 	_id: id
// }).then((result) => {
// 	console.log('Todo ', result)
// });

// Todo.findById(id).then((result) => {
// 	if(!result) {
// 		return console.log('id not found')
// 	}
// 	console.log('Todo by Id ', result)
// }).catch(e => console.log(e))

// Challenge
// query the user collection

User.findById('5985bf004d2fb11894952c81').then((result) => {
	if(!result) {
		return console.log('user not found')
	}
	console.log(JSON.stringify(result, undefined, 2))
}).catch(e => console.log(e));
