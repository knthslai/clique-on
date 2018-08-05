const router = require(`express`).Router()
const { User } = require(`../db/models`)
module.exports = router

router.get(`/`, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: [`id`, `email`]
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.put(`/:id`, async (req, res, next) => {
  console.log(`req.body`, req.body);
  try {
    const foundUser = await User.findById(Number(req.params.id))
    let newList;
    if (foundUser.channels) {
      newList = [...foundUser.channels, req.body.channel]
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