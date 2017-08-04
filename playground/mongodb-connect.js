const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to Connect to MongoDB server');
	}

	console.log('Connected to MongoDB Server');
	
	db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (err, result) => {
		if(err) {
			return console.log('Unable to insert Todo', err);
		}
		// JSON.stringify will convert a json to string
		// result.ops have all the docs that inserted
		// undefined is the filter
		// 2 is the indentation
		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	// Insert new doc into Users(name, age, location)

	db.collection('TodosTrial').insertOne({
		name: 'Plue',
		age: 28,
		location: 'bahay'
	}, (err, result) => {
		if(err) {
			return console.log('Unable to insert Todos', err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2))
	})
	db.close();
});