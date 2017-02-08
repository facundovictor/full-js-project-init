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

// Test helpers
const errorValidator = require('../helpers/error_validations');

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
  client.name.should.be.an.String();
  client.name.should.be.not.empty();
  client.name.length.should.be.belowOrEqual(50);

  client.should.have.property('email');
  client.email.should.be.an.String();
  client.email.should.be.not.empty();
  client.email.length.should.be.belowOrEqual(50);
  client.email.should.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  client.should.have.property('phone');
  client.phone.should.be.an.String();
  client.phone.should.be.not.empty();
  client.phone.length.should.be.belowOrEqual(50);
  client.phone.should.match(/^\d{3}\-\d{3}\-\d{4}$/);

  client.should.have.property('providers');
  client.providers.should.be.an.Array();
  client.providers.forEach( provider => {
    provider.should.have.property('id');
  });
}

/* Tests *********************************************************************/

describe('controllers', function() {

  describe('client', function() {

    let client_id          = 1,
        wrong_client_id    = -1,
        provider_id        = 5,
        wrong_provider_id  = -1,
        client_name        = "Some client",
        long_string        = new Array(60).join('a'),
        wrong_client_name  = long_string,
        client_email       = "some@email.com",
        wrong_client_email_long   = long_string + "@asdasd.com",
        wrong_client_email_format = "unformated-email",
        client_phone              = "123-123-1546",
        wrong_client_phone_long   = long_string,
        wrong_client_phone_format = "12312-412";

    describe(`GET ${api_path}client`, function() {

      it('should return a list of valid clients', function(done) {

        request(server)
          .get(`${api_path}client`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
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
            name      : client_name,
            email     : client_email,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('_mockReturnStatus', '201')
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

      it('Should return 400 (Bad Request) on empty body', function(done) {

        request(server)
          .post(`${api_path}client`)
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
            errorValidator.shouldBeAListOfObjectMissingRequiredErrors(error.errors, [
              'name', 'email', 'phone', 'providers'
            ]);
            done();
          });
      });

      it('Should return 400 (Bad Request) on missing name', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            email     : client_email,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
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

      it('Should return 400 (Bad Request) on missing email', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : client_name,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
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
            errorValidator.shouldBeAnObjectMissingRequiredError(error.errors[0], 'email');
            done();
          });
      });

      it('Should return 400 (Bad Request) on missing phone', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : client_name,
            email     : client_email,
            providers : [{
              id : provider_id
            }]
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
            errorValidator.shouldBeAnObjectMissingRequiredError(error.errors[0], 'phone');
            done();
          });
      });

      it('Should return 400 (Bad Request) on missing providers', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name  : client_name,
            email : client_email,
            phone : client_phone,
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
            errorValidator.shouldBeAnObjectMissingRequiredError(error.errors[0], 'providers');
            done();
          });
      });

      it('Should return 400 (Bad Request) on long name', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : wrong_client_name,
            email     : client_email,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
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

      it('Should return 400 (Bad Request) on long email', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : client_name,
            email     : wrong_client_email_long,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
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
            errorValidator.shouldBeAMaxLengthError(error.errors[0], 'email');
            done();
          });
      });

      it('Should return 400 (Bad Request) on long phone', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : client_name,
            email     : client_email,
            phone     : wrong_client_phone_long,
            providers : [{
              id : provider_id
            }]
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
            errorValidator.shouldBeAMaxLengthError(error.errors[0], 'phone');
            done();
          });
      });

      it('Should return 400 (Bad Request) on wrong phone', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : client_name,
            email     : client_email,
            phone     : wrong_client_phone_format,
            providers : [{
              id : provider_id
            }]
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
            errorValidator.shouldBeAPatternError(error.errors[0], 'phone');
            done();
          });
      });

      it('Should return 400 (Bad Request) on wrong email', function(done) {

        request(server)
          .post(`${api_path}client`)
          .send({
            name      : client_name,
            email     : wrong_client_email_format,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
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
            errorValidator.shouldBeAnInvalidFormatError(error.errors[0], 'email');
            done();
          });
      });
    });

    describe(`GET ${api_path}client/{id}`, function() {

      it('should return a valid client', function(done) {

        request(server)
          .get(`${api_path}client/${client_id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
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
            name      : client_name,
            email     : client_email,
            phone     : client_phone,
            providers : [{
              id : provider_id
            }]
          })
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
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
