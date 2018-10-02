import './weather.css'
import './icons/weather-icons.min.css'

import React, { Component, Fragment } from 'react'

import { WEATHER } from '../../config'
import _ from 'lodash'
import moment from 'moment'
import request from 'request-promise'

const TORONTO_CITY_ID = 6167865

class Weather extends Component {

  state = {
    current: {
      temp: 0,
      low: 0,
      high: 0,
      forecast: '',
      icon: ''
    },
    upcoming: []
  }

  async componentDidMount() {
    this._getWeather()
    this._getForecast()

  }

  render() {
    const { current, upcoming } = this.state
    return (
      <div className="weather">
        <div className="weather__forecast">
        <span>TODAY</span>
          <section>
            <i className={`weather__icon wi ${current.icon}`}/>
            <span>{current.forecast}</span>
          </section>
          <span>{current.temp}</span>
          <span>{current.high}</span>
          <span>{current.low}</span>
        </div>
        <div className="weather__upcoming">
        {
            upcoming.map((day, i) => {
              return (
                <div className="weather__forecast weather__forecast--upcoming" key={i}>
                  <span>{_.upperCase(day.date.format('ddd'))}</span>
                  <section>
                    <i className={`weather__icon wi ${day.icon}`}/>
                    <span>{day.forecast}</span>
                  </section>
                  <span>{day.high}</span>
                  <span>{day.low}</span>
              </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  _getWeather = async () => {
    const response = await request(
      `${WEATHER.URL}/weather?units=metric&id=${TORONTO_CITY_ID}&APPID=${WEATHER.API_KEY}`,
      { json: true }
    )
    const { name, main } = response
    const { temp, temp_min, temp_max } = main
    const weather = _.first(response.weather)

    this.setState({
      current: {
        temp: _.round(temp),
        low: _.round(temp_min),
        high: _.round(temp_max),
        forecast: _.startCase(weather.description),
        icon: this._getForecastIconClass(weather.id, true)
      }
    })
  }

  _getForecast = async () => {
    const response = await request(
      `${WEATHER.URL}/forecast?units=metric&id=${TORONTO_CITY_ID}&APPID=${WEATHER.API_KEY}`,
      { json: true }
    )
    const { list } = response
    
    const upcoming = _.chain(list)
      .groupBy(forecast => {
        return moment(forecast.dt_txt, 'YYYY-MM-DD').toString()
      })
      .map((grouped, date) => {
        const forecast = _.first(grouped)
        const weather = _.first(forecast.weather)
        const high = _.maxBy(grouped, fc => fc.main.temp).main.temp
        const low = _.minBy(grouped, fc => fc.main.temp).main.temp

        return {
          low: _.round(low),
          high: _.round(high),
          forecast: _.startCase(weather.description),
          date: moment(date),
          icon: this._getForecastIconClass(weather.id, false)
        }
      })
      .filter(({ date }) => {
        return !date.isSame(moment(), 'day')
      })
      .value()
    
    this.setState({
      upcoming
    })
  }

  _getForecastIconClass = (id, isCurrent) => {
    const date = moment()
    const hours = date.hours()
    const timeOfDay = hours > 17 ? 'night' : 'day'
    const classPrefix = isCurrent ? `wi-${timeOfDay}` : 'wi'
    
    if (id >= 801) { // cloudy
      return `${classPrefix}-cloudy`
    } else if (id >= 600 && id < 699) { // snow
      return `${classPrefix}-snow`
    } else if (id >= 500 && id < 599) { // rain
      return `${classPrefix}-rain`
    } else if (id >= 300 && id < 399) { // drizzle
      return `${classPrefix}-showers`
    } else if (id >= 200 && id < 299) { // thunderstorm
      return `${classPrefix}-cloudy`
    }

    return !isCurrent ?
      `${classPrefix}-day-sunny` :
      `${classPrefix}-${timeOfDay === 'night' ? 'clear' : 'sunny'}`

  }
}

export default Weather
