/* Tickback, by Arjan Eising 2012. License: MIT. https://github.com/arjaneising/tickback */
(function() {
  var $, defaultSettings, destroy, filter, handleResize, order, ready, render, reorderDom, resizeRender, setDefaults, setFuturePositions, tickback, tickbackElms;

  $ = window.jQuery;

  defaultSettings = {
    activeItemsFirst: true,
    animationType: 'move',
    duration: 600,
    easing: 'linear',
    itemInactiveClass: 'tb-hidden',
    sortDom: true,
    sortItems: true
  };

  tickbackElms = [];

  resizeRender = false;

  tickback = function() {
    var action, currentSettings, elms, oldSettings, options;
    elms = this;
    if (arguments.length === 2) {
      action = arguments[0];
      options = arguments[1];
    } else {
      if (typeof arguments[0] === 'string') {
        action = arguments[0];
      } else {
        options = arguments[0];
      }
    }
    currentSettings = {};
    oldSettings = elms.data('settings');
    $.extend(currentSettings, defaultSettings, oldSettings, options);
    if (currentSettings.activeItemsFirst && !currentSettings.sortItems) {
      currentSettings.sortItems = true;
    }
    elms.data('settings', currentSettings);
    if (action == null) {
      action = 'render';
    }
    switch (action) {
      case 'setDefaults':
        setDefaults(currentSettings);
        break;
      case 'destroy':
        destroy(elms, currentSettings);
        break;
      default:
        render(elms, currentSettings);
    }
    return elms;
  };

  filter = function(elms, options) {
    var elm, _i, _len;
    if (options.filterCallback == null) {
      throw 'No specified filterCallback';
    }
    for (_i = 0, _len = elms.length; _i < _len; _i++) {
      elm = elms[_i];
      elm = $(elm);
      if (options.filterCallback.call(this, elm)) {
        elm.addClass(options.itemInactiveClass);
      } else {
        elm.removeClass(options.itemInactiveClass);
      }
    }
    return elms;
  };

  order = function(elms, options) {
    if (!defaultSettings.sortItems) {
      return elms;
    }
    elms.sort(function(a, b) {
      var aHas, bHas;
      a = $(a);
      b = $(b);
      aHas = a.hasClass(options.itemInactiveClass);
      bHas = b.hasClass(options.itemInactiveClass);
      if (!options.activeItemsFirst || aHas === bHas) {
        return (typeof options.sortCallback === "function" ? options.sortCallback(a, b) : void 0) || 0;
      }
      if (aHas && !bHas) {
        return 1;
      } else {
        return -1;
      }
    });
    return elms;
  };

  render = function(elms, options) {
    var availableWidth, child, childHeight, childWidth, children, duration, elm, runBefore, sortedArrayWithchildren, stylesTo, stylesVia, _i, _j, _len, _len1, _ref, _ref1;
    for (_i = 0, _len = elms.length; _i < _len; _i++) {
      elm = elms[_i];
      elm = $(elm);
      if (elm.data('busy') === true) {
        return;
      }
      elm.data('busy', true);
      elm.data('count', 0);
      runBefore = elm.hasClass('tickback');
      if (!runBefore) {
        elm.addClass('tickback');
        elm.attr('aria-live', 'polite');
        elm.css({
          position: 'relative',
          overflow: 'hidden',
          height: elm.height()
        });
        elm.children().css({
          float: 'none',
          position: 'absolute'
        });
        tickbackElms.push(elm);
      }
      children = elm.children();
      availableWidth = elm.width();
      childWidth = children.eq(0).outerWidth(true);
      childHeight = children.eq(0).outerHeight(true);
      filter(children, options);
      sortedArrayWithchildren = order(children, options);
      setFuturePositions(sortedArrayWithchildren, availableWidth, childWidth, childHeight);
      duration = runBefore && !resizeRender ? options.duration : 0;
      if ((_ref = options.beforeAnimationCallback) != null) {
        _ref.call(elm);
      }
      elm.transition({
        height: $(sortedArrayWithchildren[sortedArrayWithchildren.length - 1]).data('to-top') + childHeight
      }, duration, options.easing);
      for (_j = 0, _len1 = children.length; _j < _len1; _j++) {
        child = children[_j];
        child = $(child);
        if ((_ref1 = options.animationType) === 'fade' || _ref1 === 'scale') {
          stylesVia = $.extend({}, options.itemViaStyles);
        }
        stylesTo = $.extend({}, (child.hasClass(options.itemInactiveClass) ? options.itemInactiveStyles : options.itemActiveStyles));
        switch (options.animationType) {
          case 'fade':
            $.extend(stylesVia, {
              opacity: 0
            });
            $.extend(stylesTo, {
              opacity: 1
            });
            break;
          case 'scale':
            $.extend(stylesVia, {
              scale: 0
            });
            $.extend(stylesTo, {
              scale: 1
            });
            break;
          default:
            $.extend(stylesTo, {
              left: child.data('to-left') + 'px',
              top: child.data('to-top') + 'px'
            });
        }
        if (stylesVia != null) {
          child.stop().transition(stylesVia, duration / 2, options.easing).transition({
            left: child.data('to-left') + 'px',
            top: child.data('to-top') + 'px'
          }, 0).transition(stylesTo, duration / 2, options.easing, ready);
        } else {
          child.stop().transition(stylesTo, duration, options.easing, ready);
        }
      }
    }
  };

  setFuturePositions = function(elms, availableWidth, childWidth, childHeight) {
    var elm, i, nthLeft, nthTop, perRow, _i, _len, _results;
    perRow = Math.floor(availableWidth / childWidth);
    i = 0;
    _results = [];
    for (_i = 0, _len = elms.length; _i < _len; _i++) {
      elm = elms[_i];
      nthLeft = i % perRow;
      nthTop = Math.floor(i / perRow);
      elm = $(elm);
      elm.data({
        'index': i,
        'to-left': nthLeft * childWidth,
        'to-top': nthTop * childHeight
      });
      _results.push(++i);
    }
    return _results;
  };

  reorderDom = function(elm) {
    var child, children, toSort, _i, _len, _results;
    children = elm.children();
    toSort = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        child = $(child);
        _results.push([child.data('index'), child]);
      }
      return _results;
    })();
    toSort.sort(function(a, b) {
      if (a[0] === b[0]) {
        return 0;
      }
      if (a[0] < b[0]) {
        return -1;
      }
      return 1;
    });
    _results = [];
    for (_i = 0, _len = toSort.length; _i < _len; _i++) {
      child = toSort[_i];
      _results.push(elm.append(child[1]));
    }
    return _results;
  };

  ready = function() {
    var amountOfChildren, currentCount, elm, options, _ref;
    elm = $(this).closest('.tickback');
    currentCount = elm.data('count');
    ++currentCount;
    elm.data('count', currentCount);
    amountOfChildren = elm.children().length;
    if (currentCount >= amountOfChildren) {
      options = elm.data('settings');
      if (options.sortDom) {
        reorderDom(elm);
      }
      elm.data('busy', false);
      resizeRender = false;
      return (_ref = options.afterAnimationCallback) != null ? _ref.call(elm) : void 0;
    }
  };

  setDefaults = function(options) {
    return $.extend(defaultSettings, options);
  };

  destroy = function(elms, options) {
    var child, key, resetStyles, styles, val, _i, _len, _ref, _results;
    styles = $.extend({}, options.itemInactiveStyles, options.itemActiveStyles);
    resetStyles = {
      float: '',
      position: '',
      top: '',
      left: ''
    };
    for (key in styles) {
      val = styles[key];
      resetStyles[key] = '';
    }
    elms.removeClass('tickback').removeAttr('aria-live');
    elms.css({
      height: '',
      overflow: '',
      position: ''
    });
    _ref = elms.children().removeClass(options.itemInactiveClass);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push($(child).css(resetStyles));
    }
    return _results;
  };

  handleResize = function() {
    var elm, options, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = tickbackElms.length; _i < _len; _i++) {
      elm = tickbackElms[_i];
      options = elm.data('settings');
      resizeRender = true;
      _results.push(elm.tickback(options));
    }
    return _results;
  };

  jQuery.fn.tickback = tickback;

  $(window).on('resize', handleResize);

}).call(this);
