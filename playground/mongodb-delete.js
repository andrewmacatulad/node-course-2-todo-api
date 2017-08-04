const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to Connect to MongoDB server');
	}

	console.log('Connected to MongoDB Server');
	

	// deleteMany
	db.collection('Todos').deleteMany({ text: 'Something to do'}).then(result => {
		console.log(result)
	})
	// deleteOne
	db.collection('Todos').deleteOne({ text: 'Something to do'}).then(result => {
		console.log(result)
	})
	// findOneAndDelete
	db.collection('Todos').findOneAndDelete({ text: 'Something to do', completed: true }).then(result => {
		console.log(result)
	})

// -- Test --
// delete with two methods
	db.collection('TodosTrial').deleteMany({ name: 'Plue', age: 28 }).then(result => {
		console.log(result)
	})
// delete by id
	db.collection('TodosTrial').findOneAndDelete({ _id: new ObjectID('598489d6d8e61b26a4b41d26') }).then(result => {
		console.log(result)
	})

	//db.close();
});