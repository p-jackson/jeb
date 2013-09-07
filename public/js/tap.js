define(['knockout', 'hammer'], function(ko, Hammer) {
   ko.bindingHandlers.tap = {
      init: function(el, valueAccessor, allBindings, vm) {
         Hammer(el).on('tap', function() {
            var handler = valueAccessor();
            handler.apply(vm);
         });
      }
   }
});
