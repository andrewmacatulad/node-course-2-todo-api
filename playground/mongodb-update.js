const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to Connect to MongoDB server');
	}

	console.log('Connected to MongoDB Server');
	

	// db.collection('Todos').findOneAndUpdate({ _id: new ObjectID('598488d7b23b30247ca622a7')}, {
	// 		$set: {
	// 			completed: true
	// 		}
	// 	}, {
	// 		returnOriginal: false
	// 	}).then(result => console.log(result));

// test
	db.collection('TodosTrial').findOneAndUpdate({ name: 'Andrew' }, {
			$inc: {
				age: -1
			}
		}, {
			returnOriginal: false
		}).then(result => console.log(result));

	//db.close();
});

