const router = require(`express`).Router()
const { User, Guest } = require(`../../server/db/models`)
module.exports = router

router.use(`/users`, require(`./users`))

router.get(`/`, async (req, res) => {
  const users = await User.findAll()
  const guests = await Guest.findAll()
  res.json({ users, guests })
})
router.use((req, res, next) => {
  const error = new Error(`Not Found`)
  error.status = 404
  next(error)
})
