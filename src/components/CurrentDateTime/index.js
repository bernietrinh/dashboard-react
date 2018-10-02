import React, { Component } from 'react'

import moment from 'moment'

class CurrentDateTime extends Component {
  state = {
    dateTime: moment()
  }
  
  componentDidMount() {
    setInterval(() => {
      this.setState({dateTime: moment()})
    }, 1000)
  }
  
  render() {
    return (
      <div>
        <h1>{this.state.dateTime.format("dddd MMMM D YYYY")}</h1>  
        <h3>{this.state.dateTime.format("h:mm:ss A")}</h3>
      </div>
    )
  }
}

export default CurrentDateTime