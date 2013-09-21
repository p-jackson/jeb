define(['backbone', 'models/book'], function(Backbone, Book) {
   return Backbone.Collection.extend({
      model: Book,
      url: '/api/books'
   });
});
