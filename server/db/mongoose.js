var mongoose = require('mongoose');


// this is for using promise
mongoose.Promise = global.Promise;
// connecting
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };