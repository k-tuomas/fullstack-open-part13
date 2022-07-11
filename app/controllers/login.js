const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    })
  
    const passwordCorrect = req.body.password === 'secret'
  
    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }
  
    const userForToken = {
      username: user.username,
      id: user.id,
    }
  
    const token = jwt.sign(userForToken, SECRET)
  
    const date = new Date()

    const session = await Session.findOne({
      where: {
        userId: user.id
      }
    })
    if (session) {
      session.expire = date.setDate(date.getDate() + 1)
    } else {
      await Session.create({ userId: user.id, expire: date.setDate(date.getDate() + 1) })
    }
  
    res
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch(err) {
    return next(err)
  }
})

module.exports = router