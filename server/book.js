var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
   title: String,
   author: String,
   publisher: String,
   year: Number
});

exports.Book = mongoose.model('Book', bookSchema);
