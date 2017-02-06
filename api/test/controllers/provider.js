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

/*
 * Given a validation error, it validates that it respects the schema
 *
 * TODO: Implement this by recovering the schema from swagger, and compare it
 *       against the real schema.
 *
 * @param error {Object}, Object to validate if it's a validation error.
 */
function validateValidationError (error) {
  error.should.have.property('message');
  error.message.should.be.equal('Validation errors');

  error.should.have.property('errors');
  error.errors.should.be.an.Array();
  error.errors.length.should.be.above(0);
}

/*
 * Given an invalid request parameter error, it validates that it respects the
 * schema.
 *
 * TODO: Implement this by recovering the schema from swagger, and compare it
 *       against the real schema.
 *
 * @param error {Object}, Object to validate if it's an invalid request para
 *                        -meter error.
 */
function validateInvalidRequestParameterError (error) {
  error.should.have.property('code');
  error.should.have.property('errors');
  error.errors.should.be.an.Array();
  error.errors.length.should.be.above(0);
  error.code.should.be.equal('INVALID_REQUEST_PARAMETER');

  error.errors[0].code.should.be.equal('OBJECT_MISSING_REQUIRED_PROPERTY');
}

/*
 * Given an missing property error, it validates that it respects the schema.
 *
 * TODO: Implement this by recovering the schema from swagger, and compare it
 *       against the real schema.
 *
 * @param error {Object}, Object to validate if it's an object missing required
 *                        property error.
 *
 * @param missingProperty {String}, the name of the missing property.
 */
function validateObjectMissingError (error, missingProperty) {
  error.code.should.be.equal('OBJECT_MISSING_REQUIRED_PROPERTY');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.params.should.containEql(missingProperty);
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
            validateValidationError(res.body);
            validateInvalidRequestParameterError(res.body.errors[0]);
            validateObjectMissingError(res.body.errors[0].errors[0], 'name');
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
            validateValidationError(res.body);
            validateInvalidRequestParameterError(res.body.errors[0]);
            validateObjectMissingError(res.body.errors[0].errors[0], 'name');
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
            validateValidationError(res.body);
            validateInvalidRequestParameterError(res.body.errors[0]);
            validateObjectMissingError(res.body.errors[0].errors[0], 'name');
            done();
          });
      });
    });

    describe(`DELETE ${api_path}provider/{id}`, function() {

      it('Should return return 204', function(done) {

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
    });
  });
});
