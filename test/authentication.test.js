const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

describe('AUTH API', () => {
    it('should return a token when email and password matches with database', (done) => {
 
        var user = {
            email: 'user1@server.nl',
            password: 'secret'
        }
        chai.request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200)
                console.dir(res.body)

                module.exports = {
                    token: res.body.result.token
                }
                done()
        })
    })
})