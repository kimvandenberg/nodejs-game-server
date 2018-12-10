const Game = require('../models/game.model')
const ApiError = require('../models/apierror.model')
const pool = require('../config/db')

module.exports = {

	getAll(req, res, next) {
		console.log('gameController.get called')
		// console.log("klant id: " + req.user.id)

		// For pool initialization, see above
		pool.query("SELECT * FROM games WHERE userID = ?", [req.user.id], function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			res.status(200).json({ result: rows}).end()

		 })
	},

	getById(req, res, next) {
		const id = req.params.gameId
		console.log('id = ' + id)

		// For pool initialization, see above
		pool.query("SELECT * FROM games where games.id = ? && games.userID = ?",[id, req.user.id] , function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			res.status(200).json({ result: rows}).end()

		 })

		// if(id < 0 || id > games.length-1){
		// 	next(new ApiError('Id does not exist', 404))
		// } else {
		// 	res.status(200).json(games[id]).end()
		// }
	},

	addNewGame(req, res, next) {
		console.log('gameController.addNewGame called')
		console.dir(req.body)

		// For pool initialization, see above
		pool.query("INSERT INTO games (title, year, type, producerID, userID) VALUES (?, ?, ?, ?, ?)",[req.body.title, req.body.year, req.body.type, req.body.producerID, req.user.id], function(err, rows, fields) {
			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			} else {
				res.status(200).json({ 
					message: req.body.title + ' is added'
				}).end()
			}
		 })

		// add game to array of games
		// const game = new Game(req.body.name, req.body.producer, req.body.year, req.body.type)
		// games.push(game)

		// res.status(200).json({ 
		// 	message: req.body.name + ' succesvol toegevoegd'
		// }).end()
	},

	updateGameById(req, res, next) {
        console.log('gameController.updateGameById called')
        console.dir(req.body)

        //var game = games[id]
        // const id = req.params.id
		
		// For pool initialization, see above
		pool.query("UPDATE games SET title = ?, year = ?, type = ?, producerID = ? WHERE id = ? && userID = ?",
			[req.body.title, req.body.year, req.body.type, req.body.producerID, req.params.id, req.user.id], 
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
				message: req.body.title + ' is updated'
			}).end()
		 })
		
        // res.status(200).json({ 
        //     message: req.body.name + ' successvol aangepast'
        // }).end()
    },

    deleteGameById(req, res, next) {
        console.log('gameController.deleteGameById called')
		
		// For pool initialization, see above
		pool.query("DELETE FROM games WHERE ID = ? && userID = ?",
			[req.params.id, req.user.id], 
			function(err, rows, fields) {

			// Connection is automatically released when query resolves
			if(err) {
				console.log(err)
				return next(new ApiError(err, 500))
			}
			if(rows == "") {
				return next(new ApiError('Object not found', 404))
			}
			res.status(200).json({ 
				message: 'Game is deleted'
			}).end()
		 })
    }

}