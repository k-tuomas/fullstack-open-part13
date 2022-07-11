const express = require('express')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor, checkSession } = require('../util/helpers')

const router = express.Router();

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = { 
      [Op.or]: [
        { title: {[Op.substring]: req.query.search}},
        { author: {[Op.substring]: req.query.search}}
      ]
    }
  }

  const blogs = await Blog.findAll({ 
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]

  })

  res.json(blogs)
})

router.post('/', tokenExtractor, checkSession, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled || req.session === 'expired') {
      return response.status(401).json({
        error: 'not authorized, please login'
      })
    }

    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()}) 
    res.json(blog)
  } catch(error) {
    return next(error)
  }
})

router.delete('/:id', blogFinder,  tokenExtractor, async (req, res) => {
  if (req.blog) {
    try {
      const user = await User.findByPk(req.decodedToken.id)

      if (user.id === req.blog.userId && req.session === 'valid') {
        await req.blog.destroy()
      } else {
        res.status(401).json({ error: "not authorized to delete this blog"})
      }

    } catch(error) {
      return next(error)
    }

  } else {
    res.status(404).end()
  }

  res.sendStatus(200).end()
})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } catch(error) {
      return next(error)
    }

  } else {
    res.status(404).end()
  }
})

module.exports = router