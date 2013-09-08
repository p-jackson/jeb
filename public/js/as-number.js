define(['knockout', 'jquery'], function(ko, $) {

   // `str` is the string to convert.
   // `precision` is the number of decimal places to use.
   // Returns null if str is empty.
   // Returns NaN if str isn't a number.
   function toNum(str, precision) {
      var roundingMultiplier = Math.pow(10, precision);

      $.trim(str);

      if (!str || !str.length)
         return null;

      // If str isn't a number then valueToWrite will be nan
      var asNumber = parseFloat(str);
      return Math.round(asNumber * roundingMultiplier) / roundingMultiplier;
   }

   ko.extenders.asNumber = function(target, precision) {
      var asStr;

      var result = ko.computed({
         read: function() {
            return asStr;
         },
         write: function(newValue) {
            asStr = newValue;
            var num = toNum(newValue, precision);
            var current = target();

            if (num !== current)
               target(num)
            else {
               if (newValue !== current)
                  target.notifySubscribers(num);
            }
         }
      });

      result(target());
      return result;
   };

});
