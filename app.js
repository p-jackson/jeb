var express = require('express');

var app = express();

var books = [
   { title: 'Emma', author: 'Jane Austin' },
   { title: 'Pride and Prejudice', author: 'Jane Austin' },
   { title: 'Bleak House', author: 'Charles Dickens' }
];

function invalidBookIndex(req, res) {
   if (books.length <= req.params.index || req.params.index < 0) {
      res.statusCode = 404;
      res.json('Book not found');
      return true;
   }

   return false;
}

var sendIndex = function(req, res) {
   res.sendfile(__dirname + '/public/index.html');
};

app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));
app.get('/add', sendIndex);
app.get('/search', sendIndex);

app.use(express.favicon());


app.use(express.logger('dev'));

app.get('/books', function(req, res) {
   res.json(books);
});

app.get('/books/:index', function(req, res) {
   if (invalidBookIndex(req, res))
      return;

   res.json(books[req.params.index]);
});

app.post('/books', function(req, res) {
   books.push({
      title: req.body.title,
      author: req.body.author
   });

   res.setHeader('Location', '/books/' + (books.length - 1));
   res.statusCode = 201;
   res.json(true);
});

app.delete('/books/:index', function(req, res) {
   if (invalidBookIndex(req, res))
      return;

   books.splice(req.params.index, 1);
   res.json(true);
});



var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
