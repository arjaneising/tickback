$ = window.jQuery



# Can be overriden for all tickbacks on the page with f.e. $.tickback('setDefaults', { duration: 500 });
defaultSettings =
  activeItemsFirst: true
  animationType: 'move'
  duration: 600
  easing: 'linear'
  itemInactiveClass: 'tb-hidden'
  sortDom: true
  sortItems: true



tickbackElms = []
resizeRender = false



# Main function
tickback = ->
  elms = this

  # 2 arguments: action with options
  if arguments.length is 2
    action = arguments[0]
    options = arguments[1]
  # 1 argument: only options or an action without options.
  else
    if typeof arguments[0] is 'string'
      action = arguments[0]
    else
      options = arguments[0]

  currentSettings = {}
  oldSettings = elms.data 'settings'
  $.extend currentSettings, defaultSettings, oldSettings, options

  if currentSettings.activeItemsFirst and not currentSettings.sortItems
    currentSettings.sortItems = true

  elms.data 'settings', currentSettings

  action ?= 'render'

  switch action
    when 'setDefaults'
      setDefaults currentSettings
    when 'destroy'
      destroy elms, currentSettings
    else
      render elms, currentSettings

  elms



# Filter the elements based on a callback function.
filter = (elms, options) ->
  unless options.filterCallback?
    throw 'No specified filterCallback'

  for elm in elms
    elm = $ elm

    if options.filterCallback.call this, elm
      elm.addClass options.itemInactiveClass
    else
      elm.removeClass options.itemInactiveClass

  elms




# Sort if needed
order = (elms, options) ->
  return elms unless defaultSettings.sortItems

  elms.sort (a, b) ->
    a = $ a
    b = $ b

    aHas = a.hasClass(options.itemInactiveClass)
    bHas = b.hasClass(options.itemInactiveClass)

    # If we want to place active items first, this only runs if a and b have the filtered class
    if not options.activeItemsFirst or aHas is bHas
      return options.sortCallback?(a, b) || 0
    # Place active items first
    if aHas and not bHas
      return 1
    else
      return -1

  elms



# Another self-explanatory function name
render = (elms, options) ->
  for elm in elms
    elm = $ elm

    # Don't run during an animation
    return if elm.data('busy') is true
    elm.data('busy', true)

    elm.data 'count', 0

    runBefore = elm.hasClass 'tickback'

    unless runBefore
      elm.addClass 'tickback'
      elm.attr 'aria-live', 'polite'
      elm.css
        position: 'relative'
        overflow: 'hidden'
        height: elm.height()
      elm.children().css
        float: 'none'
        position: 'absolute'
      tickbackElms.push elm

    children = elm.children()
    availableWidth = elm.width()
    childWidth = children.eq(0).outerWidth true
    childHeight = children.eq(0).outerHeight true

    filter(children, options)
    sortedArrayWithchildren = order children, options
    setFuturePositions sortedArrayWithchildren, availableWidth, childWidth, childHeight

    duration = if (runBefore and not resizeRender) then options.duration else 0

    options.beforeAnimationCallback?.call elm

    # Make the element use the proper height
    elm.transition {
        height: $(sortedArrayWithchildren[sortedArrayWithchildren.length - 1]).data('to-top') + childHeight
      },
      duration,
      options.easing

    for child in children
      child = $ child

      # Logic for transiting elements
      # Fade and scale go via some (specified or unspecified) styles
      if options.animationType in ['fade', 'scale']
        stylesVia = $.extend {}, options.itemViaStyles
      
      # Target styles
      stylesTo = $.extend {}, (if child.hasClass(options.itemInactiveClass) then options.itemInactiveStyles else options.itemActiveStyles)

      switch options.animationType
        when 'fade'
          $.extend stylesVia,
            opacity: 0

          $.extend stylesTo,
            opacity: 1
        when 'scale'
          $.extend stylesVia,
            scale: 0

          $.extend stylesTo,
            scale: 1
        else
          $.extend stylesTo,
            left: child.data('to-left') + 'px'
            top: child.data('to-top') + 'px'

      if stylesVia?
        child.stop().transition(
          stylesVia,
          duration / 2,
          options.easing
        ).transition({
            left: child.data('to-left') + 'px'
            top: child.data('to-top') + 'px'
          },
          0
        ).transition(
          stylesTo,
          duration / 2,
          options.easing
          ready
        )
      else
        child.stop().transition stylesTo, duration, options.easing, ready

  return



# Calculate the left / top coordinates for the future positions.
setFuturePositions = (elms, availableWidth, childWidth, childHeight) ->
  perRow = Math.floor(availableWidth / childWidth)

  i = 0

  for elm in elms
    nthLeft = i % perRow
    nthTop = Math.floor(i / perRow)

    elm = $ elm
    elm.data
      'index': i
      'to-left': nthLeft * childWidth
      'to-top': nthTop * childHeight

    ++i



# Shuffle the children based on index data after animation complete
reorderDom = (elm) ->
  children = elm.children()

  toSort = for child in children
    child = $ child
    [child.data('index'), child]

  toSort.sort (a, b) ->
    if a[0] is b[0]
      return 0
    if a[0] < b[0]
      return -1
    1

  for child in toSort
    elm.append child[1]



# Called when a child elments finished animating. Call callback if all children are done.
ready = ->
  elm = $(this).closest '.tickback'
  currentCount = elm.data 'count'
  ++currentCount
  elm.data 'count', currentCount

  amountOfChildren = elm.children().length

  if currentCount >= amountOfChildren
    options = elm.data 'settings'
    reorderDom elm if options.sortDom
    elm.data 'busy', false
    resizeRender = false
    options.afterAnimationCallback?.call elm



# Overwrite default settings.
setDefaults = (options) ->
  $.extend defaultSettings, options



# Remove all styles and classes from wrapper and it's children.
destroy = (elms, options) ->
  styles = $.extend({}, options.itemInactiveStyles, options.itemActiveStyles)

  resetStyles =
    float: ''
    position: ''
    top: ''
    left: ''

  for key, val of styles
    resetStyles[key] = ''

  elms.removeClass('tickback').removeAttr('aria-live')
  elms.css
    height: ''
    overflow: ''
    position: ''

  for child in elms.children().removeClass options.itemInactiveClass
    $(child).css resetStyles



handleResize = ->
  for elm in tickbackElms
    options = elm.data 'settings'
    resizeRender = true
    elm.tickback options



# Make it usable for everyone.
jQuery.fn.tickback = tickback

$(window).on 'resize', handleResize