import React from 'react'
import moment from 'moment'

const CurrentDateTime = () => (
    <div>
        {moment().format("MMM Do YY")}
    </div>
)

export default CurrentDateTime