var mongoose = require('mongoose');


// this is for using promise
mongoose.Promise = global.Promise;
// connecting
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };