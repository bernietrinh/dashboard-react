import React, { Component } from 'react'

import _ from 'lodash'
import moment from 'moment'
import request from 'request-promise'

class SoldHomeRecords extends Component {
  state = {
    soldHomes: []
  }

  componentDidMount() {
    this._bindSoldRecords()
  }

  render() {
    return (
      <div>
        {
          _.map(this.state.soldHomes, (date, i) => {
            return (
              <div key={i}>
                <h1>{i}</h1>
                {
                  _.map(date, (sold, i) => (
                    <div key={i}>
                      {sold.Address1} {sold.Address2} | Sold: {sold.Sold} | List: {sold.List}
                      <div>{sold["Sold Date"]}</div>
                    </div>

                  ))
                }
              </div>

            )
          })
        }
      </div>
    )
  }

  _bindSoldRecords = async () => {
    let soldHomes = []
    const date = moment()

    while (soldHomes <= 0) {
      const responses = await Promise.all([
        request(this._getReportUrlForDate(date.subtract(1, 'days').format('M/D/YYYY')), { json: true }),
        request(this._getReportUrlForDate(date.subtract(1, 'days').format('M/D/YYYY')), { json: true })
      ])
      soldHomes = _.chain(responses).flatMap(r => r).keyBy(r => r['Sold Date']).value()
    }

    this.setState({ soldHomes })

  }
  _getReportUrlForDate = (date) => {
    return `https://mongohouse.com/api/reports?date=${date}&city=Toronto`
  }

}

export default SoldHomeRecords