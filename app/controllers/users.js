const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: Blog,
      attributes: ['title']
    }
  })

  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  let where = {}

  if (req.query.read === 'true') {
    where = {
      read: true
    }
  }
  if (req.query.read === 'false') {
    where = {
      read: false
    }
  }

  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'title'],
          through: {
            attributes: []
          },
          include: {
            model: ReadingList,
            attributes: ['id', 'read'],
            where
          },
        }

      ]
    })

    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch(err) {
    next(err)
  }

})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  try {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } catch(error) {
    return next(error)
  }

})

module.exports = router