const Sequelize = require(`sequelize`)
const db = require(`../db`)

const Guest = db.define(`guest`, {
  name: {
    type: Sequelize.STRING,
  },
  session: {
    type: Sequelize.STRING
  },
  UUID: {
    type: Sequelize.STRING
  },
  channels: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
})

module.exports = Guest
