const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch(error) {
      next(error)
      res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}

const checkSession = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const session = await Session.findOne({
      where: {
        userId: user.id
      }
    })
    if (!session) {
      res.status(401).json({ error: 'session missing' })
    } else {
      const now = new Date()
      if ( session.expire.getTime() >= now.getTime() ) {
        req.session = 'valid'
      } else {
        req.session = 'expired'
      }
    }

  } catch(err) {
    next(err)
    res.status(401).json({ error: 'session invalid' })

  }

  next()
}


module.exports = { tokenExtractor, checkSession }