const router = require(`express`).Router()
const { User, Guest } = require(`../db/models/`)
module.exports = router

router.post(`/login`, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
      console.log(`No such user found:`, req.body.email)
      res.status(401).send(`Wrong username and/or password`)
    } else if (!user.correctPassword(req.body.password)) {
      console.log(`Incorrect password for user:`, req.body.email)
      res.status(401).send(`Wrong username and/or password`)
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

// /auth/guest
router.put(`/guest`, async (req, res, next) => {

  try {
    const newGuest = req.body
    // console.log(`newGuest`, newGuest);
    await Guest.findOrCreate({ where: { session: req.body.session }, defaults: { ...newGuest } }).spread((user) => { req.login(user, err => (err ? next(err) : res.json(user))) })

  } catch (err) {
    if (err.name === `SequelizeUniqueConstraintError`) {
      res.status(401).send(`User already exists`)
    } else {
      next(err)
    }
  }
})

// /auth/signup
router.post(`/signup`, async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === `SequelizeUniqueConstraintError`) {
      res.status(401).send(`User already exists`)
    } else {
      next(err)
    }
  }
})
// -> /auth/logout
router.post(`/logout`, (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect(`/`)
})
// -> /auth/me
router.get(`/me`, (req, res) => {
  if (req.user) {
    res.json(req.user)
  } else {
    req.login(req.sessionID, err => (err ? next(err) : res.json(req.sessionID)))
  }
})
// -> /auth/session
router.get(`/session`, (req, res) => {
  res.json(req.sessionID)
})
// -> /auth/google
router.use(`/google`, require(`./google`))
