const express = require('express')
const cors = require('cors');
require('dotenv').config()

const blogsRouter = require('./routes/blogs')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/blogs', blogsRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

