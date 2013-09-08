define(['knockout', 'knockback', 'models/book', 'as-number'], function(ko, kb, Book) {

   return kb.ViewModel.extend({
      constructor: function() {
         kb.ViewModel.prototype.constructor.call(this, new Book());

         this.adding = ko.observable(false);
         this.year = this.year.extend({ asNumber: 0 });

         this.buttonText = ko.computed(function() {
            return this.adding() ? 'Adding...' : 'Add';
         }.bind(this));
      },
      onSubmit: function() {
         this.adding(true);
         this.model().save({}, {
            success: this.addComplete.bind(this),
            error: this.addError.bind(this)
         });
      },
      onBack: function() {
         Backbone.trigger('showHome');
      },
      addComplete: function() {
         this.model().set(this.model().defaults);
         this.adding(false);
      },
      addError: function() {
         this.adding(false);
      }
   });

});
