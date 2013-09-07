requirejs.config({
   baseUrl: '/js',
   paths: {
      'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
      'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
      'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
      'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
      'knockout': '//cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min'
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
   'vm/search'
], function(Backbone, ko, homeView, HomeViewModel, addView, AddViewModel, searchView, SearchViewModel) {

   function switchView(view, ViewModel) {
      var c = document.getElementById('viewContainer');
      c.innerHTML = view;
      ko.applyBindings(new ViewModel(router), c.firstChild);
   }

   var Workspace = Backbone.Router.extend({
      routes: {
         'home': 'home',
         'add': 'add',
         'search': 'search',
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
      }
   });

   var router = new Workspace();

   Backbone.history.start({ pushState: true });
});
