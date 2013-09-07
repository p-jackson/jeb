define(['knockout', 'models/book'], function(ko, Book) {
   function AddViewModel(router) {
      this.adding = ko.observable(false);
      this.title = ko.observable('');
      this.author = ko.observable('');

      this.buttonText = ko.computed(function() {
         return this.adding() ? 'Adding...' : 'Add';
      }.bind(this));

      this._router = router;
   }

   AddViewModel.prototype.onSubmit = function() {
      this.adding(true);

      var book = new Book({
         title: this.title(),
         author: this.author()
      });

      Backbone.sync('create', book, {
         success: this.addComplete.bind(this),
         error: this.addError.bind(this)
      });
   };

   AddViewModel.prototype.onBack = function() {
      this._router.navigate('', { trigger: true });
   };

   AddViewModel.prototype.addComplete = function() {
      this.title('');
      this.author('');
      this.adding(false);
   };

   AddViewModel.prototype.addError = function() {
      this.adding(false);
   };

   return AddViewModel;
});
