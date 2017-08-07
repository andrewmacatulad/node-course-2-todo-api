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
	text: 'Second test todo',
	completed: true,
	completedAt: 23423
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
		request(app)
			.get(`/todo/${id.toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/todo/123')
			.expect(404)
			.end(done);
	});
})

describe('DELETE /todo/:id', () => {
	it('should remove a todo', (done) => {
		const id = todos[1]._id.toHexString();
		request(app)
			.delete(`/todo/${id}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(id).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	})

	it('should return a 404 if todo not found', (done) => {
		const id = new ObjectID();
		request(app)
			.delete(`/todo/${id.toHexString()}`)
			.expect(404)
			.end(done);
	})

	it('should return a 404 if object id is invalid', (done) => {
		request(app)
			.delete('/todo/123')
			.expect(404)
			.end(done);
	})
})

describe('PATCH /todo/:id', () => {
	it('should update the todo', (done) => {
		const id = todos[0]._id.toHexString();
		const text = 'this should be the new text';
			request(app)
			.patch(`/todo/${id}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	})

	it('should clear completedAt when todo is not completed', (done) => {
		const id = todos[1]._id.toHexString();
		const text = 'this should be the new text!';
			request(app)
			.patch(`/todo/${id}`)
			.send({
				completed: false,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	})
})