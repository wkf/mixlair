# workaround for a bug with facebook's oauth implementation
if window.location.hash and window.location.hash is '#_=_'
  if window.history and history.pushState
    window.history.pushState('', document.title, window.location.pathname)
  else
    scrollTop = document.body.scrollTop
    scrollLeft = document.body.scrollLeft
    window.location.hash = ''
    document.body.scrollTop = scrollTop
    document.body.scrollLeft = scrollLeft

console.log 'Coffeescript Works!'