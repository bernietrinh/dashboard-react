import _ from 'lodash'
import config from './config'
import request from 'request-promise'

const { WEATHER, NEWS, NEST } = config
const TORONTO_CITY_ID = 6167865
const HVAC_STATE = {
    HEATING: 'heating',
    COOLING: 'cooling'
}

class DashboardService {
    
    async getNestThermostat() {
        const url = `${NEST.URL}/thermostat`
        
        const response = await this._request(url, { withCredentials: true })
    
        const { name_long, target_temperature_c, ambient_temperature_c, has_leaf, hvac_state } = response.thermostat
        const state = hvac_state === HVAC_STATE.HEATING || hvac_state === HVAC_STATE.COOLING ? hvac_state : null

        return {
            name: name_long,
            targetTemp: target_temperature_c,
            currentTemp: ambient_temperature_c,
            inEcoMode: has_leaf,
            state
        }
    }

    async getNews(source, sort) {
        const url = `${NEWS.URL}?source=${source}&sortBy=${sort}&apiKey=${NEWS.API_KEY}`
        
        const response = await request(url)
        return response
    }

    async getWeather() {
        const url = `${WEATHER.URL}/weather?units=metric&id=${TORONTO_CITY_ID}&APPID=${WEATHER.API_KEY}`

        const response = await request(url)
        return response
    }

    _request = (url, options) => {
        return request(url, _.assign({ json: true }, options))
    }
}

export default DashboardService