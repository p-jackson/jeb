define(['knockout', 'knockback', 'backbone', 'models/book'], function(ko, kb, Backbone, Book) {

   var BookViewModel = kb.ViewModel.extend({
      open: function() {
         Backbone.trigger('showBook', this.model());
      }
   });


   function SearchViewModel() {
      this.searchTerm = ko.observable('');
      this.books = kb.collectionObservable(new Backbone.Collection(), {
         view_model: BookViewModel
      });
   }

   SearchViewModel.prototype.onBack = function() {
      Backbone.trigger('showHome');
   };

   SearchViewModel.prototype.onSearch = function() {
      var c = new Backbone.Collection([], {
         model: Book,
         url: '/books?q=' + this.searchTerm()
      });

      c.fetch({
         reset: true,
         success: function() {
            this.books.collection(c);
         }.bind(this)
      });
   };

   return SearchViewModel;
});