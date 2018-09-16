const nestManager = require('../managers/Nest')

module.exports = class NestController {

    _login(req, res) {
        nestManager.getAccessToken()
        .then(accessToken => {
            res.cookie('dashboardToken', accessToken)
            res.status(200).send({ accessToken })
        })
        .catch(error => {
            console.dir(error)
            res.status(400).send(error)
        })
    }

    _getThermostat(req, res) {
        nestManager.getThermostat(req.cookies.dashboardToken)
        .then(({ accessToken, thermostat }) => {
            res.cookie('dashboardToken', accessToken)
            res.status(200).send({ thermostat })
        })
        .catch(error => {
            console.dir(error)
            res.status(400).send(error)
        });
    }

    _changeThermostatTemperature(req, res) {
        nestManager.changeThermostatTemperature(req.cookies.dashboardToken)
        .then(({ accessToken, thermostat }) => {
            res.cookie('dashboardToken', accessToken)
            res.status(200).send({ thermostat })
        })
        .catch(error => {
            console.dir(error)
            res.status(400).send(error)
        });
    }

    register(router) {
        router.get('/login', this._login)
        router.get('/thermostat', this._getThermostat)
        return router
    }

}
