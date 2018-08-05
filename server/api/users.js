const router = require(`express`).Router()
const { User, Guest } = require(`../db/models`)
module.exports = router

// router.get(`/`, async (req, res, next) => {
//   try {
//     const users = await User.findAll({
//       attributes: [`id`, `email`]
//     })
//     res.json(users)
//   } catch (err) {
//     next(err)
//   }
// })

router.put(`/guests/:id`, async (req, res, next) => {
  try {
    const foundUser = await Guest.findById(Number(req.params.id))
    let newList;
    if (foundUser.channels) {
      newList = [...foundUser.channels.slice(-4), req.body.channel]
    } else {
      newList = [req.body.channel]
    }
    await Guest.update({ channels: newList }, { where: { id: Number(req.params.id) } }
    )
    res.json(newList)
  } catch (err) {
    next(err)
  }
})

router.put(`/:id`, async (req, res, next) => {
  try {
    const foundUser = await User.findById(Number(req.params.id))
    let newList;
    if (foundUser.channels) {
      newList = [...foundUser.channels.slice(-4), req.body.channel]
    } else {
      newList = [req.body.channel]
    }
    await User.update({ channels: newList }, { where: { id: Number(req.params.id) } }
    )
    res.json(newList)
  } catch (err) {
    next(err)
  }
})