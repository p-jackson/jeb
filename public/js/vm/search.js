define(['knockout'], function(ko) {
   function SearchViewModel(router) {
      this.searchTerm = ko.observable('');
      this.books = ko.observableArray([]);

      this._router = router;
   }

   SearchViewModel.prototype.onBack = function() {
      this._router.navigate('', { trigger: true });
   };

   SearchViewModel.prototype.onSearch = function() {
      
   };

   return SearchViewModel;
});