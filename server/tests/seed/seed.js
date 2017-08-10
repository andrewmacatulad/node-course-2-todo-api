const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo')
const { User } = require('./../../models/user');

const user1 = new ObjectID();
const user2 = new ObjectID();
const users = [{
	_id: user1,
	email: 'plue@plue.com',
	password: 'user1',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: user1, access: 'auth'}, 'test123').toString()
	}]
}, {
	_id: user2,
	email: 'plue1@plue.com',
	password: 'user2'
}]

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
},
{
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 23423
}
]

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();
		return Promise.all([userOne, userTwo])
	}).then(() => done());
} 
module.exports = { todos, populateTodos, users, populateUsers };