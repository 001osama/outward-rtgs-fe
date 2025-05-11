const decodeJwt = (token) => {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

const getToken = () => {
  try {
    const token = localStorage.getItem('token')
    const parsedToken = decodeJwt(token)
    console.log('parsed token is working', parsedToken)
    return parsedToken
  } catch (ex) {
    console.error('Error occurred while decoding token')
    console.error(ex)
  }
  return null
}

export { getToken }
