const config = require( '../../config')
const request = require('request-promise')
const { NEST } = config;

class NestManager {

    getThermostat(accessToken) {
        return this.ensureLoggedIn(accessToken, this.requestThermostat)
        .then(response => {
            const { thermostat } = response;
            const newAccessToken = response.accessToken;
            console.log(`[Nest Manager] Request for thermostat info complete with access token: ${accessToken}`);
            return {
                accessToken: accessToken === newAccessToken ? accessToken : newAccessToken,
                thermostat
            }
        });
    }

    changeThermostatTemperature(accessToken) {
        return Promise.resolve({ accessToken: null, thermostat: null });
    }

    getAccessToken() {
        return this._submitLoginCreds()
        .then(this._getAuthCode)
        .then(this._exchangeForAccessToken)
        .catch(error => {
            // TODO: handle error
            console.log('error', error);
        });
    }

    requestThermostat(accessToken) {
        console.log(`[Nest Manager] Requesting thermostat info with access token: ${accessToken}`);
        return request({
                uri: `https://developer-api.nest.com/devices/thermostats/${NEST.DEVICE_ID}`,
                json: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(thermostat => {
                return {
                    accessToken: accessToken,
                    thermostat
                }
            });
    }

    ensureLoggedIn(accessToken, nestAction) {
        return nestAction(accessToken)
        .catch(error => {
            if (error.statusCode === 401) {
                console.log(`Not logged in - access token: ${accessToken}`);
                return this.getAccessToken()
                .then(newAccessToken => {
                    return nestAction(newAccessToken);
                })
            }

            throw error;
        });
    }

    _submitLoginCreds() {
        return request({
            uri: 'https://home.nest.com/session',
            method: 'POST',
            json: true,
            form: {
                email: NEST.EMAIL,
                password: NEST.PASSWORD
            },
        })
        .then(res => {
            const accessToken = res.access_token;
            const userId = res.userid;
            return { accessToken, userId };
        });
}

    _getAuthCode(nestUserInfo) {
        const { userId, accessToken } = nestUserInfo;
        return request({
            url: `https://home.nest.com/api/0.1/oauth2/users/${userId}/client/${NEST.ID}`,
            method: 'POST',
            json: true,
            headers: {
                Authorization: `Basic ${accessToken}`
            }
        })
        .then(res => res.code);
    }

    _exchangeForAccessToken(authCode) {
        return request({
            url: `https://api.home.nest.com/oauth2/access_token`,
            method: 'POST',
            json: true,
            form: {
                code: authCode,
                client_id: NEST.ID,
                client_secret: NEST.SECRET,
                grant_type: 'authorization_code'
            },
        })
        .then(res => res.access_token);
    }

}

const nestManager = new NestManager()

module.exports = nestManager