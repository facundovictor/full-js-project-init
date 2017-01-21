var should = require('should');
var request = require('supertest');
var server = require('../../app');



function validateClientWithProvider (client) {
    client.should.have.property('name');
    client.should.have.property('email');
    client.should.have.property('phone');
    client.should.have.property('providers');

    client.providers.forEach( provider => {
        provider.should.have.property('id');
    });
}


describe('controllers', function() {

  describe('client', function() {

    let client_id = 1;

    describe('GET /client', function() {

      it('should return a list of valid clients', function(done) {

        request(server)
          .get('/client')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Array();
            // No clients is a valid response
            if (res.body.length > 0)
                res.body.forEach(validateClientWithProvider);
            done();
          });
      });
    });

    describe('POST /client', function() {

      it('Should return a new valid client', function(done) {

        request(server)
          .post('/client')
          .send({
            name      : 'Some client',
            email     : 'some@email.com',
            phone     : '1242342343',
            providers : [{
              id : 3
            }]
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateClientWithProvider(res.body);

            /* If it's an integration test, save the id to run the next tests */
            if (res.body.id)
              client_id = res.body.id;

            done();
          });
      });
    });

    describe('GET /client/{id}', function() {

      it('should return a valid client', function(done) {

        request(server)
          .get('/client/'+client_id)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateClientWithProvider(res.body);
            done();
          });
      });
    });

    describe('PUT /client/{id}', function() {

      it('Should return the modified client', function(done) {

        request(server)
          .put('/client/'+client_id)
          .send({
            id        : client_id,
            name      : 'Some client',
            email     : 'some@email.com',
            phone     : '1242342343',
            providers : [{
              id : 3
            }]
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateClientWithProvider(res.body);
            done();
          });
      });
    });

    describe('DELETE /client/{id}', function() {

      it('Should return return 204', function(done) {

        request(server)
          .delete('/client/'+client_id)
          .set('Accept', 'application/json')
          // TODO: Fix the mocked API that is returning 500
          .expect(204)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.empty();
            done();
          });
      });
    });
  });
});
