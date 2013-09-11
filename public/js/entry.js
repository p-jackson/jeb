requirejs.config({
   baseUrl: '/js',
   paths: {
      'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
      'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
      'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
      'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
      'knockout': '//cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min',
      'knockback': 'libs/knockback/0.17.2/knockback',
      'hammer': '//cdnjs.cloudflare.com/ajax/libs/hammer.js/1.0.5/hammer.min'
   },
   shim: {
      'backbone': {
         deps: ['underscore', 'jquery'],
         exports: 'Backbone'
      },
      'underscore': {
         exports: '_'
      },
      'jquery': {
         exports: '$'
      }
   }
});

define([
   'backbone',
   'knockout',
   'text!views/home.html',
   'vm/home',
   'text!views/add.html',
   'vm/add',
   'text!views/search.html',
   'vm/search',
   'text!views/book.html',
   'vm/book',
   'models/book',
   'tap'
], function(Backbone, ko, homeView, HomeViewModel, addView, AddViewModel, searchView, SearchViewModel, bookView, BookViewModel, Book) {

   var clobberView = false;

   function switchView(view, ViewModel, model) {
      var c = document.getElementById('viewContainer');
      if (clobberView)
         c.innerHTML = view;
      clobberView = true;
      var vm = model ? new ViewModel(model, router) : new ViewModel(router);
      ko.applyBindings(vm, c.querySelector('.appView'));
   }

   var Workspace = Backbone.Router.extend({
      routes: {
         'home': 'home',
         'add': 'add',
         'search': 'search',
         'view-book/:id': 'viewBook',
         '': 'home'
      },

      home: function() {
         switchView(homeView, HomeViewModel);
      },

      add: function() {
         switchView(addView, AddViewModel);
      },

      search: function() {
         switchView(searchView, SearchViewModel);
      },

      viewBook: function(id) {
         var book = new Book({ _id: id });
         book.fetch();
         switchView(bookView, BookViewModel, book);
      }
   });

   var router = new Workspace();

   Backbone.history.start({ pushState: true });

   Backbone.on('showHome', function() {
      router.navigate('', { trigger: true });
   });

   Backbone.on('showAdd', function() {
      router.navigate('/add', { trigger: true });
   });

   Backbone.on('showSearch', function() {
      router.navigate('/search', { trigger: true });
   });

   Backbone.on('showBook', function(book) {
      switchView(bookView, BookViewModel, book);
      router.navigate('view-book/' + book.id);
   });
});
