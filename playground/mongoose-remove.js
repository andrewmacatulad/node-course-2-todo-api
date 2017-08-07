const { ObjectID } = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const { User } = require('./../server/models/user');

Todo.remove({}).then((result) => {
	console.log(result)
})


Todo.findOneAndRemove({_id: '59872d56cee9af2a9885d46c'}).then((todo) => {
	console.log(todo);
})

Todo.findByIdAndRemove('59872cfb30b3fe2700b79df0').then((todo) => {
	console.log(todo);
})