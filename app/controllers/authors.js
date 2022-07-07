const express = require('express')
const { Blog, User } = require('../models')
const { Op, fn, col } = require('sequelize')

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      attributes: [
          'author',
          [fn('count', col('id')), 'articles'],
          [fn('sum', col('likes')), 'likes']
        ],
      group: ['author'],
      raw: true
    })

    res.json(blogs)
  } catch(error) {
    return next(error)
  }
})

module.exports = router