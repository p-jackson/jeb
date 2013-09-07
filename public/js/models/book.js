define(['backbone'], function(Backbone) {
   return Backbone.Model.extend({
      url: 'books',
      
      defaults: {
         title: '',
         author: ''
      }
   });
});
