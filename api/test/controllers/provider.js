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

// Test helpers
const errorValidator = require('../helpers/error_validations');

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
  provider.name.should.be.an.String();
  provider.name.should.be.not.empty();
  provider.name.length.should.be.belowOrEqual(50);
}

/* Tests *********************************************************************/

describe('controllers', function() {

  describe('provider', function() {

    let provider_id         = 1,
        wrong_provider_id   = -1,
        wrong_provider_name = new Array (1000).join('a');
        wrong_provider_name_short = '';

    describe(`GET ${api_path}provider`, function() {

      it('should return a list of valid providers', function(done) {

        request(server)
          .get(`${api_path}provider`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
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
            name : 'Some provider'
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
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

      it('Should return 400 (Bad request) on missing required parameter', function(done) {

        request(server)
          .post(`${api_path}provider`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '400')
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            errorValidator.shouldBeAValidationError(res.body);
            let error = res.body.errors[0];
            errorValidator.shouldBeAnInvalidRequestParameterError(error);
            errorValidator.shouldBeAnObjectMissingRequiredError(error.errors[0], 'name');
            done();
          });
      });

      it('Should return 400 (Bad request) on shorter name parameter', function(done) {

        request(server)
          .post(`${api_path}provider`)
          .send({
            name : wrong_provider_name_short
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '400')
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            errorValidator.shouldBeAValidationError(res.body);
            let error = res.body.errors[0];
            errorValidator.shouldBeAnInvalidRequestParameterError(error);
            errorValidator.shouldBeAMinLengthError(error.errors[0], 'name');
            done();
          });
      });

      it('Should return 400 (Bad request) on longer name parameter', function(done) {

        request(server)
          .post(`${api_path}provider`)
          .send({
            name : wrong_provider_name
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '400')
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            errorValidator.shouldBeAValidationError(res.body);
            let error = res.body.errors[0];
            errorValidator.shouldBeAnInvalidRequestParameterError(error);
            errorValidator.shouldBeAMaxLengthError(error.errors[0], 'name');
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
            name : 'Some provider'
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            validateProvider(res.body);
            done();
          });
      });

      it("Should return 404 (Not found) if the id doesn't exist", function(done) {

        request(server)
          .put(`${api_path}provider/${wrong_provider_id}`)
          .send({
            id   : wrong_provider_id,
            name : 'Some provider'
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '404')
          .expect(404)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.have.property('message');
            done();
          });
      });

      it("Should return 400 (Bad Request) on empty request body", function(done) {

        request(server)
          .put(`${api_path}provider/${provider_id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '400')
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            errorValidator.shouldBeAValidationError(res.body);
            let error = res.body.errors[0];
            errorValidator.shouldBeAnInvalidRequestParameterError(error);
            errorValidator.shouldBeAnObjectMissingRequiredError(error.errors[0], 'name');
            done();
          });
      });

      it("Should return 400 (Bad Request) on missing required data", function(done) {

        request(server)
          .put(`${api_path}provider/${provider_id}`)
          .send({
            id   : provider_id
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '400')
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            errorValidator.shouldBeAValidationError(res.body);
            let error = res.body.errors[0];
            errorValidator.shouldBeAnInvalidRequestParameterError(error);
            errorValidator.shouldBeAnObjectMissingRequiredError(error.errors[0], 'name');
            done();
          });
      });

      it("Should return 400 (Bad Request) on longer name property", function(done) {

        request(server)
          .put(`${api_path}provider/${provider_id}`)
          .send({
            id   : provider_id,
            name : wrong_provider_name
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '400')
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.an.Object();
            errorValidator.shouldBeAValidationError(res.body);
            let error = res.body.errors[0];
            errorValidator.shouldBeAnInvalidRequestParameterError(error);
            errorValidator.shouldBeAMaxLengthError(error.errors[0], 'name');
            done();
          });
      });
    });

    describe(`DELETE ${api_path}provider/{id}`, function() {

      it('Should return return 204 (No content) on success', function(done) {

        request(server)
          .delete(`${api_path}provider/${provider_id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '204')
          .expect(204)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.be.empty();
            done();
          });
      });

      it('Should return return 404 (Not found) on invalid ID', function(done) {

        request(server)
          .delete(`${api_path}provider/${wrong_provider_id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '404')
          .expect(404)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });
    });
  });
});
