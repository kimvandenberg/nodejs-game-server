
const ApiError = require('../models/apierror.model')
const pool = require('../config/db')
const config = require('../config/config')
var jwt = require('jsonwebtoken');

module.exports = {

	register(req, res, next) {
		console.log('auth.controller called')

        const query = 'INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`) VALUES (?, ?, ?, ?)';
		// For pool initialization, see above
        pool.query(query,
        [req.body.firstname, req.body.lastname, req.body.email, req.body.password ], 
        function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			res.status(200).json({ result: rows}).end()

		 })
    },
    
    login(req, res, next) {
		console.log('auth.controller called')

		// const query = 'SELECT * FROM users WHERE users.email = ? AND users.password = ?';
		const query = 'SELECT * FROM users WHERE users.email = ?';
		const email = req.body.email || ''
		const password = req.body.password || ''

		pool.query(query,
			[email],
			function(err, rows, fields) {
				
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			if(rows == "") {
				return next(new ApiError('User bestaat niet', 500))
			}

			console.log('user found')
			console.dir(rows)
			if(password === rows[0].password) {
				console.log('Password komt overeen')

				console.log(config.secretKey)
				jwt.sign({ id: rows[0].ID }, config.secretKey, (err, token) => {
					if(err) {
						console.log(err)
						return next(new ApiError('Token kan niet worden gemaakt', 500))
					}
					
					console.log('Token is validated')
		
					res.set('x-access-token', token)
					res.status(200).json({
						result: {
							firstname: rows[0].firstname,
							lastname: rows[0].lastname,
							token: token
						}
					}).end()

					// const payload = {
					// 	exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
					// 	token: token
					// }
					// res.status(200).json({ 
					// 	info: payload
					// }).end()
				});
			}

			// if(rows == "") {
			// 	return next(new ApiError('Login bestaat niet', 500))
			// }
			// res.status(200).json({ 
			// 	message: req.body.email + ' is ingelogd'
			// }).end()
		 })
	},

	validateJWT(req, res, next) {
		// const token = require('../../test/authentication.test').token
		const token = req.header('x-access-token')
		if(!token) {
			return next(new ApiError('Required token is missing', 404))
		}

		jwt.verify(token, config.secretKey, (err, payload) => {
			// Als er geen valid token is
			if(err) {
				return next(new ApiError('Invalid token', 404))
			}
			console.log('---------------------------------------------------------------')
			console.log('Token is validated')
			console.dir(payload)
			
			req.user = {
				id: payload.id
			}
			next()
		})
	}
}