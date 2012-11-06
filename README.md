# jQuery TickBack`

**[See DEMO](http://arjaneising.github.com/tickback)**

---

**What is it?** A jQuery plugin to animate the filtering of a list.

**Requirements?** A proper jQuery version (1.8+), jQuery Transit (currently an unofficial unmerged fork with proper browser support). Also: the items in the list shoudl have the same dimensions.

**Affects on load time?** Apart from the big jQuery, we load jQuery Transit (5.8kB). TickBack is under 4kB big.

**How does it work?** You specify on initial load of the plugin a callback function, which is used to determine if an element on the list should be filtered out.

---


## Example

    $('ul').tickback({
      duration: 600,
      animationType: 'move',
      filterCallback: function(elm) {
        return !elm.hasClass('my-filter');
      },
      itemInactiveStyles: {
        opacity: 0.4
      },
      itemActiveStyles: {
        opacity: 1
      }
    });


## Documentation

### Methods provided

* `var myList = $('.my-list').tickback(options)` — on initial load, the options should be passed. There is only one required option: `filterCallback` (see below).
* `myList.tickback('render'[, options])` — triggers rerendering, for example if you clicked a link that filters the list, or typed in a search.
* `myList.tickback('setDefaults', options)` — overwrites default values for the passed new ones.
* `myList.tickback('destroy'[, options])` — removes classes and styles from the list.

### Options that can be passed:
The options hash accepts the following options:

* `filterCallback` [function, **required**] — callback on how to filter the items. Should return a boolean.
* `afterAnimationCallback` and `beforeAnimationCallback` [functions] – can be used to let you know when the animations start and end.
* `animationType` [`"move"` (default), `"fade"`, `"scale"`] — how the elements are animated.
* `duration` [int] — amount of milliseconds the animation has to last.
* `easing` [string] — any easing type the jQuery Transit plugin accepts. [See their documentation.](http://ricostacruz.com/jquery.transit/). Eg `"cubic-bezier(0,0.9,0.3,1)"` or `"in-out"`.
* `itemInactiveClass` [string] — which class there shoudl be on the inactive items. Can be used for additional styling if you want to, or by your own jQuery code.
* `itemInactiveStyles`, `itemActiveStyles`, `itemViaStyles` [objects] — shoudl contain CSS properties as keys and their wanted values as content. The `via` one is  not used by the move animation type.
* `sortCallback` [function] — Gets two jQuery arrays with one element in them: object `a` and `b`. The function should compare something in those elements, for example the text or a class on it, and return either `-1` (`a` comes before `b`), `0` (`a` and `b` are sorted equally) or `1` (`a` comes after `b`).
* `sortDom` [bool, `true` by default] — whether the DOM should be ordered after the animation is complete. (Keep true if you want screenreaders to properly speak out the order of elements. An ARIA live region is used to notify of the change.)
* `sortItems` [bool, `true` by default] — if true, the active items are placed as first in the DOM.

---

## Requirements
* jQuery (1.8+), can be downloaded from [jQuery.com](http://jquery.com).
* [jQuery Transit](http://ricostacruz.com/jquery.transit/). This is a custom build which can be found at [symbiose's Transit repo](https://github.com/symbiose/jquery.transit/blob/6b78a6edfb36db7bbef7f27fbf02786210689e06/jquery.transit.js).
* Every block in the list should have equal dimensions.


## Thanks
* @SURFnet


## License
MIT Licensed. Do whatever you want with it, but don't sue me when it crashes your server and you lose all your money. See also the file `LICENSE`.


## Upcoming features

* Properly *hiding* filtered items (instead of giving them alternative styles).