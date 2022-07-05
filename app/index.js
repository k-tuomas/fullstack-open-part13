const express = require('express')
const cors = require('cors');
const { Sequelize, Model, DataTypes } = require('sequelize')
require('dotenv').config()

const blogsRouter = require('./routes/blogs')

const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

app.use(cors())
app.use(express.json())
app.use('/blogs', blogsRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})