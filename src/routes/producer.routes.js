const router = require('express').Router()
const producerController = require('../controllers/producer.controller')

router.get('/producers', producerController.getAll)
router.get('/producers/:producerId', producerController.getById)
router.post('/producers', producerController.addNewProducer)
router.delete('/producers/delete/:id', producerController.deleteProducerById)
router.put('/producers/update/:id', producerController.updateProducerById) 

module.exports = router