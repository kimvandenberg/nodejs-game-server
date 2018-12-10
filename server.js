const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const gameRoutes = require('./src/routes/game.routes')
const authRoutes = require('./src/routes/auth.routes')
const producerRoutes = require('./src/routes/producer.routes')
const authController = require('./src/controllers/auth.controller')
const ApiError = require('./src/models/apierror.model')

var app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.use('/api', authRoutes)

app.all('*', authController.validateJWT)

// reguliere routing
app.use('/api', gameRoutes)
app.use('/api', producerRoutes)

// handler voor niet-bestaande routes
app.use('*', (req, res, next) => {
	console.log('ohoh')
	next(new ApiError('Non-existing endpoint', 404))
})

// handler voor errors
app.use('*', (err, req, res, next) => {
	// hier heb ik de error
	console.dir(err)
	// -> return response naar caller
	res.status(err.code).json({error: err}).end()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// for testing purpose
module.exports = app
