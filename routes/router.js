const router = require("express").Router()

const processRouter = require("./process")

router.use("/", processRouter)

module.exports = router