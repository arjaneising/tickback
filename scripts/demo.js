// Generated by CoffeeScript 1.3.3
(function() {
  var currentFilters;

  currentFilters = 'mekmek';

  $('ul').tickback({
    duration: 600,
    animationType: 'move',
    filterCallback: function(elm) {
      return !elm.hasClass(currentFilters);
    },
    sortCallback: function(a, b) {
      var aText, bText;
      aText = a.text();
      bText = b.text();
      if (aText < bText) {
        return -1;
      }
      if (aText > bText) {
        return 1;
      }
      return 0;
    },
    itemInactiveStyles: {
      backgroundColor: 'gray',
      opacity: 0.5
    },
    itemActiveStyles: {
      backgroundColor: 'green',
      opacity: 1
    }
  });

  $('.filters a').click(function(e) {
    e.preventDefault();
    currentFilters = $(this).attr('data-filter');
    return $('ul').tickback('filter');
  });

}).call(this);
