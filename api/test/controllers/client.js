/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Tests for the client controller.
 *
 * References:
 *   https://shouldjs.github.io/
 *   https://github.com/visionmedia/supertest
 */

// Library imports
const should = require('should');
const request = require('supertest');

// Project imports
const server = require('../../app');
const api_path = '/api/';

// Environment variables
const isIntegrationTest = process.env.INTEGRATION;

/* Test helpers **************************************************************/

/*
 * Given a client, it validates that it respects the schema.
 *
 * TODO: Implement this by recovering the schema from swagger, and compare it
 *       against the real schema.
 *
 * @param client {Object}, Object to validate if it's a client.
 */
function validateClientWithProvider (client) {
    client.should.have.property('name');
    client.should.have.property('email');
    client.should.have.property('phone');
    client.should.have.property('providers');

    client.providers.forEach( provider => {
        provider.should.have.property('id');
    });
}

/* Tests *********************************************************************/

describe('controllers', function() {

  describe('client', function() {

    let client_id = 1;

    describe(`GET ${api_path}client`, function() {

      it('should return a list of valid clients', function(done) {

        request(server)
          .get(`${api_path}client`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
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

    describe(`POST ${api_path}client`, function() {

      it('Should return a new valid client', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : 'Some client',
            email     : 'some@email.com',
            phone     : '1242342343',
            providers : [{
              id : 3
            }]
          })
          .set('Accept', 'application/json')
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateClientWithProvider(res.body);

            /* If it's an integration test, save the id to use it on the next
             * tests.
             */
            if (isIntegrationTest)
              client_id = res.body.id;

            done();
          });
      });
    });

    describe(`GET ${api_path}client/{id}`, function() {

      it('should return a valid client', function(done) {

        request(server)
          .get(`${api_path}client/${client_id}`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateClientWithProvider(res.body);
            done();
          });
      });
    });

    describe(`PUT ${api_path}client/{id}`, function() {

      it('Should return the modified client', function(done) {

        request(server)
          .put(`${api_path}client/${client_id}`)
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
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateClientWithProvider(res.body);
            done();
          });
      });
    });

    describe(`DELETE ${api_path}client/{id}`, function() {

      it('Should return return 204', function(done) {

        request(server)
          .delete(`${api_path}client/${client_id}`)
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
