const ApiError = require('../models/apierror.model')
const pool = require('../config/db')

module.exports = {

	getAll(req, res, next) {
		console.log('producerController.get called')

		// For pool initialization, see above
		pool.query("SELECT * FROM producer WHERE userID = ?", [req.user.id], function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			res.status(200).json({ result: rows}).end()
		 })
    },
    
    getById(req, res, next) {
		const id = req.params.producerId

		// For pool initialization, see above
		pool.query("SELECT * FROM producer where ID = ? && userID = ?",[id, req.user.id] , function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			res.status(200).json({ result: rows}).end()

		 })
	},

	addNewProducer(req, res, next) {
		console.log('producerController.addNewProducer called')

		// For pool initialization, see above
		pool.query("INSERT INTO producer (name, description, userID) VALUES (?, ?, ?)",[req.body.name, req.body.description, req.user.id], function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			res.status(200).json({ 
				message: req.body.name + ' is added'
			}).end()
		 })
	},

	updateProducerById(req, res, next) {
        console.log('producerController.updateProducerById called')
		
		// For pool initialization, see above
		pool.query("UPDATE producer SET name = ?, description = ? WHERE ID = ? && userID = ?",
			[req.body.name, req.body.description, req.params.id, req.user.id], 
			function(err, rows, fields) {

			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			console.log(rows.affectedRows)
			if(rows.affectedRows == 0) {
				return next(new ApiError('Object not found', 404))
			}
			res.status(200).json({ 
				message: req.body.name + ' is updated'
			}).end()
		 })
    },

    deleteProducerById(req, res, next) {
        console.log('producerController.deleteProducerById called')
		
		// For pool initialization, see above
		pool.query("DELETE FROM producer WHERE ID = ? && userID = ?",
			[req.params.id, req.user.id], 
			function(err, rows, fields) {

			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			if(rows.affectedRows == 0) {
				return next(new ApiError('Object not found', 404))
			}
			res.status(200).json({ 
				message: 'Producer is deleted'
			}).end()
		 })
    }
}