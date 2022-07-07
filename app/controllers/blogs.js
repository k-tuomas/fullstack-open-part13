const express = require('express')
const jwt = require('jsonwebtoken')
const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const router = express.Router();

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

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
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
      if (user.id === req.blog.userId) {
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