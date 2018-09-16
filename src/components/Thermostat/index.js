import './thermostat.css'

import React, { Component, Fragment } from 'react'

import DashboardService from '../../DashboardService'
import leafImg from './leaf.png'

// class definition
class Thermostat extends Component {

    constructor() {
        super()
        this.dashboardService = new DashboardService()

        this.state = {
            thermostat: {}
        }
    }

    async componentDidMount() {
        // set initial thermostat
        this._setThermostat()

        // set up interval to update thermostat
        const tick = 300000
        window.setInterval(this._setThermostat, tick)
    }

    _setThermostat = async () => {
        try {
            const thermostat = await this.dashboardService.getNestThermostat()
    
            this.setState({
                thermostat
            })
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        const { thermostat } = this.state
        const { name, state, currentTemp, targetTemp, inEcoMode } = thermostat
        return (
            <div className="thermostat">
                {
                    thermostat &&
                    <Fragment>
                        <div className={`thermostat__wrapper ${state ? `thermostat__wrapper--${state}` : ''}`}>
                            <div className="thermostat__content">
                                <h2 className="thermostat__subtitle">{name}</h2>
                                <h3 className="thermostat__subtitle">{currentTemp}</h3>
                                <h1 className="thermostat__title">{targetTemp}</h1>
                                {
                                    inEcoMode &&
                                    <img className="thermostat__img" src={leafImg} />
                                }
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        )
    }
}

export default Thermostat