const express = require('express')
const { Sequelize } = require('sequelize')

const { Blog } = require('../models/blog')

const router = express.Router();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})


router.get('/api/blogs', async (req, res) => {

  res.json(blogs)
})

router.post('/api/blogs', async (req, res) => {

  res.send(todo)
})

router.delete('/api/blogs', async (req, res) => {

  res.sendStatus(200)
})

module.exports = router