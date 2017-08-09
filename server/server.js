require('./config/config')

const _ = require('lodash');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');


var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')
const { authenticate } = require('./middleware/authenticate')

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

app.delete('/todo/:id', (req, res) => {
	var id = req.params.id

	// Check if Id is Valid
	if(!ObjectID.isValid(id)) {
		return res.status(404).send('Error ka');
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}, (e) => {
		res.status(400).send();
	})

})

app.patch('/todo/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }



  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
	.then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	})
})

// USERS
app.post('/users', (req,res) => {
	var body = _.pick(req.body, ['email', 'password'])

	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send('Mali');
	})
})



app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
})

app.listen(port, () => {
	console.log(`Started up at ${port}`);
})

module.exports = { app };