define(['backbone', 'jquery'], function(Backbone, $) {
   return Backbone.Model.extend({
      urlRoot: '/books',
      idAttribute: '_id',
      
      defaults: {
         title: '',
         author: '',
         publisher: '',
         year: null
      },

      validate: function(attrs, options) {
         $.trim(attrs.title);
         if (!attrs.title.length)
            return 'Books must have a title';
         $.trim(attrs.author);
         if (!attrs.author.length)
            return 'Books must have an author';
         if (attrs.year !== null && isNaN(attrs.year))
            return "Year's got to be a number";
         if (attrs.year < 0)
            return "That's not a year!";
      }
   });
});
