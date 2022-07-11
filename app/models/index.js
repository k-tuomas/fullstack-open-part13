const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const Session = require('./session')

User.hasMany(Session)
Session.belongsTo(User)

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList, as: 'readinglists' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

Blog.hasMany(ReadingList)
ReadingList.belongsTo(Blog)


module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}