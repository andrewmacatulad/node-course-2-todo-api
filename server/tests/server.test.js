const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
},
{
	_id: new ObjectID(),
	text: 'Second test todo'
}
]

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
})

describe('POST /todos', () => {
	it('should create a new todo', (done) =>{
		var text = 'testing lang to kasi';

		request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			// this end is for asynchronous
			.end((err, res) => {
				if(err) {
				  return done(err);
				}

				Todo.find({ text }).then((todos) => {
					expect(todos.length).toBe(1)
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			})
	})

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err) {
					console.log(err)
				  return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2)
					done();
				}).catch((e) => done(e));
			})
	})
})

describe('GET /todos', () => {
	it('should get all todo', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	})
})

describe('GET /todo/:id', () => {
	it('should get todo by Id', (done) => {
		request(app)
		// the toHexString will convert the id to a string
		// the todos[0]._id will get the id from the first todo
			.get(`/todo/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		const id = new ObjectID();
		// make sure you get a 404 back
		request(app)
			.get(`/todo/${id.toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		// /todos/123
		request(app)
			.get('/todo/123')
			.expect(404)
			.end(done);
	});
})