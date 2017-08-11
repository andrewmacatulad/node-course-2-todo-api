var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
	const config = require('./config.json')
	// to access a property using a variable use bracket notation which is the [env]
	const envConfig = config[env];

	// this is an array the key is the key of PORT and MONGODB_URI
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	})
}

// if(env === 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
