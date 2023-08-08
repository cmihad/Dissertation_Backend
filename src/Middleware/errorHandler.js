module.exports = function errorHandler(err, req, res, next) {
  console.error(err.message) // Log error message in our server's console

  // If err has no specified error status, we set it to 500
  const status = err.status || 500

  // If err has no specified error message, we set it to a general 'Server Error'
  const message = err.message || 'Server Error'

  // We send status and error message as a response to the client
  res.status(status).json({ status: 'error', message })

  // If you don't want to send the error details to the client,
  // you can just send the status code: res.sendStatus(status);
}
