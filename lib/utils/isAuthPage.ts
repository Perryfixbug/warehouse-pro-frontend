const AUTH_PAGES = ['/login', '/reset-password', '/forgot-password']

export function isAuthPage(){
  return AUTH_PAGES.some((page)=>(
    page === window.location.pathname || window.location.pathname.startsWith(page)
  ))
}
