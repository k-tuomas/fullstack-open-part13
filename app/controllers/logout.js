const router = require('express').Router()
const { User, Session } = require('../models')
const { tokenExtractor, checkSession } = require('../util/helpers')


router.delete('/', tokenExtractor, checkSession,  async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if ( user && req.session === 'valid') {
      await Session.destroy({
        where: {
          userId: user.id
        }
      })
  
      res.sendStatus(200).end()
    } else {
      res.status(401).json({ error: "cannot logout"})
    }

  } catch(err) {
    return next(err)
  }

})

module.exports = router