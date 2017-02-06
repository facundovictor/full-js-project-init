/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Tests for the provider controller.
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
 * Given a provider, it validates that it respects the schema.
 *
 * TODO: Implement this by recovering the schema from swagger, and compare it
 *       against the real schema.
 *
 * @param provider {Object}, Object to validate if it's a provider.
 */
function validateProvider (provider) {
    provider.should.have.property('id');
    provider.should.have.property('name');
}

/* Tests *********************************************************************/

describe('controllers', function() {

  describe('provider', function() {

    let provider_id       = 1,
        wrong_provider_id = -1;

    describe(`GET ${api_path}provider`, function() {

      it('should return a list of valid providers', function(done) {

        request(server)
          .get(`${api_path}provider`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
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

    describe(`POST ${api_path}provider`, function() {

      it('Should return a new valid provider', function(done) {

        request(server)
          .post(`${api_path}provider`)
          .send({
            name : 'Some provider',
          })
          .set('Accept', 'application/json')
          .set('_mockReturnStatus', '201')
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateProvider(res.body);

            /* If it's an integration test, save the id to use it on the next
             * tests.
             */
            if (isIntegrationTest)
              provider_id = res.body.id;

            done();
          });
      });
    });

    describe(`PUT ${api_path}provider/{id}`, function() {

      it('Should return the modified provider', function(done) {

        request(server)
          .put(`${api_path}provider/${provider_id}`)
          .send({
            id   : provider_id,
            name : 'Some provider',
          })
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateProvider(res.body);
            done();
          });
      });

      it("Should return 404 if the id doesn't exist", function(done) {

        request(server)
          .put(`${api_path}provider/${wrong_provider_id}`)
          .send({
            id   : wrong_provider_id,
            name : 'Some provider',
          })
          .set('Accept', 'application/json')
          .set('_mockReturnStatus', '404')
          .expect(404)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });
    });

    describe(`DELETE ${api_path}provider/{id}`, function() {

      it('Should return return 204', function(done) {

        request(server)
          .delete(`${api_path}provider/${provider_id}`)
          .set('Accept', 'application/json')
          .set('_mockReturnStatus', '204')
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
