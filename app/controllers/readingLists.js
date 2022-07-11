const express = require('express')
const { ReadingList, User } = require('../models')
const { tokenExtractor, checkSession } = require('../util/helpers')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.findAll()

    res.json(readingList)
  } catch(err) {

    return next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.create({ userId: req.body.userId, blogId: req.body.blogId})

    res.json(readingList)
  } catch(err) {
    return next(err)
  }

})

router.put('/:id', tokenExtractor, checkSession, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled || req.session === 'expired') {
      return response.status(401).json({
        error: 'account disabled, please login'
      })
    }
    
    const readingList = await ReadingList.findByPk(req.params.id)

    if (readingList.userId === user.id) {
      readingList.read = req.body.read
      await readingList.save()
      res.json(readingList)
    } else {
      res.status(401)
    }

  } catch(err) {
    return next(err)
  }
})

module.exports = router