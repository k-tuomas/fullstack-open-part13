const { DataTypes, fn } = require('sequelize')


module.exports = {
  async up ({ context: queryInterface }) {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: { 
        min: 1991,
        max: new Date().getFullYear()
       }
    })
  },

  async down ({ context: queryInterface }) {
   await queryInterface.removeColumn('blogs', 'year')
  }
};
