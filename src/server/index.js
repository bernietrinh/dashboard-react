const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const express = require('express')
const routes = require('./routes')

const app = new express()
const port = 4000

app.use(cors({
    exposedHeaders: ['Link'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(bodyParser())
app.use('/nest', routes.nest)

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});

