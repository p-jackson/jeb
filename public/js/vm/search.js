define(['knockout', 'knockback', 'backbone', 'models/book'], function(ko, kb, Backbone, Book) {

   function SearchViewModel(router) {
      this.searchTerm = ko.observable('');
      this.books = kb.collectionObservable();

      this._router = router;
   }

   SearchViewModel.prototype.onBack = function() {
      this._router.navigate('', { trigger: true });
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