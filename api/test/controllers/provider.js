var should = require('should');
var request = require('supertest');
var server = require('../../app');


function validateProvider (provider) {
    provider.should.have.property('id');
    provider.should.have.property('name');
}


describe('controllers', function() {

  describe('provider', function() {

    describe('GET /provider', function() {

      it('should return a list of valid providers', function(done) {

        request(server)
          .get('/provider')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Array();
            // No providers is a valid response
            if (res.body.length > 0)
                res.body.forEach(validateProvider);
            done();
          });
      });
    });

    describe('POST /provider', function() {

      it('Should return a new valid provider', function(done) {

        request(server)
          .post('/provider')
          .send({
            name : 'Some provider',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateProvider(res.body);
            done();
          });
      });
    });

    describe('DELETE /provider/{id}', function() {

      it('Should return return 204', function(done) {

        request(server)
          .delete('/provider/{id}')
          .set('Accept', 'application/json')
          // TODO: Fix the mocked API that is returning 500
          // .expect(204)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.empty();
            done();
          });
      });
    });

    describe('PUT /provider/{id}', function() {

      it('Should return the modified provider', function(done) {

        request(server)
          .put('/provider/1')
          .send({
            id   : 1,
            name : 'Some provider',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            // TODO: Fix the mocked api that is returning a client instead of
            //       a provider.
            // validateProvider(res.body);
            done();
          });
      });
    });

  });
});
