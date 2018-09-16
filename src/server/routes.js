const NestController = require('./controllers/Nest')
const express = require('express')
const router = express.Router()
const nestController = new NestController()

module.exports = {
    nest: nestController.register(router)
}
