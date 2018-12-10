const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

const endpointToTest = '/api/games';

describe('Games API POST', () => {
    it('should return a valid game when posting a valid object', (done) => {

        const token = require('./authentication.test').token;

        console.log('TOKEN ' + token)
        chai.request(server)
            .post(endpointToTest)
            .set('x-access-token', token)
            .send({
                'title': 'gameName',
                'year': 2018,
                'type': 'typeOfGame',
                'producerID': 1,
                'userID': 1
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                //Get object from body the response.
                const Games = res.body;
                
                const util = require('util')
                console.log(123 + util.inspect(res.body, false, null, true))
                
                //Check if properties are still existent in object returned.
                Games.should.have.property('message');

                //Do the properties still match?
                Games.message.should.equal('gameName is added');
                
                done();
        })
    });

    it('should return a 500 error on posting an invalid object.', (done) => {
        const token = require('./authentication.test').token;

        chai.request(server)
            .post(endpointToTest)
            .set('x-access-token', token)
            .send({
                'name': 'gameName',
            })
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')

                done();
        })
    });
})

describe('Calling an invalid route or failed call, should return an object of type ApiError', () => {
    it('should return a 404 error.', (done) => {

        const token = require('./authentication.test').token;

        chai.request(server)
            .get('/api/gamesasdasdssss')
            .set('x-access-token', token)
            .end((err, res) => {
            
                const util = require('util')
                console.log(123 + util.inspect(res.body, false, null, true))

                // res.should.have.status(404)

                res.body.should.be.a('object');

                const error = res.body.error;

                //Check if properties are still existent in object returned.
                error.should.have.property('message');
                error.should.have.property('code');
                error.should.have.property('date');

                //Check if values match the expected return value.
                error.message.should.equal('Non-existing endpoint');
                error.code.should.equal(404);

                done();
        })
    });
})

describe('Games API PUT', () => {

    it('should return a valid game when puting a valid object', (done) => {
        const token = require('./authentication.test').token;

        chai.request(server)
            .put(endpointToTest + "/update/1")
            .set('x-access-token', token)
            .send({
                'title': 'gameNamee',
                'year': 2018,
                'type': 'typeOfGamee',
                'producerID': 2
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const Games = res.body
                
                //Check if properties are still existent in object returned.
                Games.should.have.property('message')

                //Do the properties still match?
                Games.message.should.equal('gameNamee is updated')

                done()
        })
    });

    it('should return a 404 error that object cannot be modified as it is non existent', (done) => {
        const token = require('./authentication.test').token;

        chai.request(server)
            .put(endpointToTest + "/update/5345436660")
            .set('x-access-token', token)
            .send({
                'title': 'gameName',
                'producer': 'gameProducer',
                'year': 2020,
                'type': 'typeOfGame'
            })
            .end((err, res) => {
                const util = require('util')
                console.log(123 + util.inspect(res.body, false, null, true))

                res.should.have.status(404)
                res.body.should.be.a('object')

                const error = res.body.error;
                
                //Check if properties are still existent in object returned.
                error.should.have.property('message');
                error.should.have.property('code');
                error.should.have.property('date');

                // //Do the properties still match?
                error.message.should.equal('Object not found');
                error.code.should.equal(404);


                done();
        })
    });
})


describe('Games API GetAll', () => {

    it('should return a valid array of games (x) item', (done) => {
        const token = require('./authentication.test').token;

        chai.request(server)
            .get(endpointToTest)
            .set('x-access-token', token)
            .send()
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                console.dir(res.body);
                //Take the first element;
                const Games = res.body;

                for(var i = 0; i < Games.length; i++){

                    //Object games consists out of (name, producer, year, type)
                    if(Games[i].title && Games[i].producer && Games[i].year  && Games[i].type){

                        //Check if properties are still existent in object returned.
                        Games[i].should.have.property('title');
                        Games[i].should.have.property('year');
                        Games[i].should.have.property('type');
                        Games[i].should.have.property('producerID');
                    }
                }
                done();
        })
    });
})

describe('Games API GetById', () => {

    it('should return a valid game when getting object', (done) => {
        const token = require('./authentication.test').token;
 
        chai.request(server)
            .get(endpointToTest + '/1')
            .set('x-access-token', token)
            .send()
            .end((err, res) => {
                const util = require('util')
                console.log(123 + util.inspect(res.body, false, null, true))

                res.should.have.status(200)
                res.body.should.be.a('object')
                const Games = res.body.result;

                done();
        })
    });
})

describe('Games API Delete', () => {

    it('should return status 200 and the message succesfully removed ', (done) => {
        const token = require('./authentication.test').token;
 
        chai.request(server)
            .del(endpointToTest + '/delete/2')
            .set('x-access-token', token)
            .send()
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                const response = res.body;
                
                //Check if properties are still existent in object returned.
                response.should.have.property('message');

                //Do the properties still match?
                response.message.should.equal('Game is deleted');

                //console.dir(res.body);
                done();
        })
    });
})


describe('Games API Delete Non Existing', () => {

    it('should return status 404', (done) => {
        const token = require('./authentication.test').token;

        chai.request(server)
            .del(endpointToTest + '/10789789700')
            .set('x-access-token', token)
            .send()
            .end((err, res) => {
                const util = require('util')
                console.log(123 + util.inspect(res.body, false, null, true))
                res.should.have.status(404)
                res.body.should.be.a('object')

                const response = res.body.error;
                //Check if properties are still existent in object returned.
                 response.should.have.property('message');
                 response.should.have.property('code');
                 response.should.have.property('date');

                // //Do the properties still match?
                response.message.should.equal('Non-existing endpoint');

                //console.dir(res.body);
                done();
        })
    });
})