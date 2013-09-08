define(function() {

   return function() {
      this.onAdd = function() {
         Backbone.trigger('showAdd');
      },

      this.onSearch = function() {
         Backbone.trigger('showSearch');
      }
   };

});
