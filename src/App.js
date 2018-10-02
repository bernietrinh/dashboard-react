// dependencies
import './App.css';

import React, { Component } from 'react'

import CurrentDateTime from './components/CurrentDateTime'
import SoldHomeRecords from './components/SoldHomeRecords/index'
import Thermostat from './components/Thermostat'
import Weather from './components/Weather'

// class definition
class App extends Component {
  render() {
    return (
      <div className="App">
        <CurrentDateTime />
        <Weather />
        <Thermostat />
        <SoldHomeRecords />
      </div>
    )
  }
}

export default App
