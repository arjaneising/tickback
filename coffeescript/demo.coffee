currentFilters = 'mekmek'

$('ul').tickback
  duration: 600
  animationType: 'move'
  filterCallback: (elm) ->
    not elm.hasClass currentFilters
  sortCallback: (a, b) ->
    aText = a.text()
    bText = b.text()

    if aText < bText
      return -1
    if aText > bText
      return 1
    return 0
  itemInactiveStyles:
    backgroundColor: 'gray'
    opacity: 0.5
  itemActiveStyles:
    backgroundColor: 'green'
    opacity: 1


$('.filters a').click (e) ->
  e.preventDefault()
  currentFilters = $(this).attr 'data-filter'
  $('ul').tickback 'filter'