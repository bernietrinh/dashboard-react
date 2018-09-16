// dependencies
import './App.css';

import React, { Component } from 'react'

import CurrentDateTime from './components/CurrentDateTime'
import Thermostat from './components/Thermostat'
import Weather from './components/Weather'

// class definition
class App extends Component {
  render() {
    return (
      <div className="App">
        <CurrentDateTime />
        <Thermostat />
        <Weather />
      </div>
    )
  }
}

export default App
