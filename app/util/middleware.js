
const errorHandler = (error, request, response, next) => {
  console.log()
  console.log()
  console.log()
  console.log(error)
  if (error.name === 'SequelizeValidationError') {
    const errorObject = {}
    error.errors.map(e => {
      errorObject[e.path] = e.message
    })

    return response.status(400).json({errorObject})
  }

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({error: 'invalid input syntax'})
  }

  next(error)
}

module.exports = {
  errorHandler
}