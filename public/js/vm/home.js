define(function() {

   return function(router) {
      this.onAdd = function() {
         router.navigate('/add', { trigger: true });
      },

      this.onSearch = function() {
         router.navigate('/search', { trigger: true });
      }
   };

});
