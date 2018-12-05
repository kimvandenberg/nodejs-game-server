
const ApiError = require('../models/apierror.model')
const pool = require('../config/db')

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

		const query = 'SELECT * FROM users WHERE users.email = ? AND users.password = ?';
		pool.query(query,
			[req.body.email, req.body.password],
			function(err, rows, fields) {
				
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			if(rows == "") {
				return next(new ApiError('Login bestaat niet', 500))
			}
			res.status(200).json({ 
				message: req.body.email + ' is ingelogd'
			}).end()
		 })
    }
}