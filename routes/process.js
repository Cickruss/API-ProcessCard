const router = require("express").Router()

const ProcessController = require("../controllers/ProcessController")


router
.route("/success")
.post((req, res) => ProcessController.create(req, res))

module.exports = router