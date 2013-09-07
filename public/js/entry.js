requirejs.config({
   baseUrl: '/js',
   paths: {
      'backbone': 'libs/backbone/1.0.0/backbone',
      'underscore': 'libs/underscore/1.5.1/underscore',
      'zepto': 'libs/zepto/1.0-1/zepto',
      'text': 'libs/text/2.0.10/text',
      'knockout': 'libs/knockout/2.3.0/knockout'
   },
   shim: {
      'backbone': {
         deps: ['underscore', 'zepto'],
         exports: 'Backbone'
      },
      'underscore': {
         exports: '_'
      },
      'zepto': {
         exports: '$'
      }
   }
});

define([
   'backbone',
   'knockout',
   'zepto',
   'text!views/home.html',
   'vm/home',
   'text!views/add.html',
   'vm/add'
], function(Backbone, ko, $, homeView, HomeViewModel, addView, AddViewModel) {

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
      }
   });

   var router = new Workspace();

   Backbone.history.start({ pushState: true });
});
