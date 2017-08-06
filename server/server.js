var express = require('express');
var app = express();
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');


var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')

app.use(bodyParser.json());


app.post('/todos', (req,res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc)
	},e => {
		res.status(400).send(e);
	})
})

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({ todos });
	}, (e) => {
		res.status(400).send(e);
	})
})

// GET /todos/121456

app.get('/todo/:id', (req, res) => {
	var id = req.params.id
	
	// Check if Id is Valid
	if(!ObjectID.isValid(id)) {
		return res.status(404).send('Error');
	}

	Todo.findById(id).then((todo) => {
		// this is for checking if todo is not empty
		if(!todo) {
			return res.status(404).send('');
		}

		res.send({todo});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.listen(port, () => {
	console.log(`Started up ${port}`);
})

module.exports = { app };