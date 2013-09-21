var Book = require('./book').Book;
var logger = require('./log');

exports.setup = function(app) {
   app.get('/api/books', getBooks);
   app.get('/api/books/:id', getBooksId);
   app.post('/api/books', postBooks);
   app.delete('/api/books/:id', deleteBooksId);
};

function getBooks(req, res) {
   if (!req.query || !req.query.q)
      var q = Book.find();
   else {
      var re = new RegExp(req.query.q, 'i');
      var q = Book.find({
         $or: [
            { title: re },
            { author: re }
         ]
      });
   }

   q.exec(function(err, docs) {
      if (err)
         logger.error(err);
      else {
         res.json(docs);
      }
   });
}

function getBooksId(req, res) {
   Book.findById(req.params.id).exec(function(err, book) {
      if (err) {
         res.statusCode = 404;
         res.json('Book not found');
      }
      else
         res.json(book);
   });
}

function postBooks(req, res) {
   var b = new Book(req.body)

   b.save(function(err, book) {
      if (err) {
         logger.error('failed');
      }
      else {
         res.setHeader('Location', '/books/' + book.id);
         res.statusCode = 201;
         res.json(true);
      }
   });
}

function deleteBooksId(req, res) {
   Book.findByIdAndRemove(req.params.id, function(err, book) {
      if (err) {
         res.statusCode = 404;
         res.json('Book not found');
      }
      else
         res.json(true);
   });
}
