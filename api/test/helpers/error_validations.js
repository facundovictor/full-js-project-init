
/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * List of error validations. The error is formatted on the module
 * "swagger-node-runner", and the list of errors are part of "sway" (operation
 * object).
 *
 * Reference:
 *  https://github.com/apigee-127/sway/blob/master/docs/API.md#swayvalidationentry--object
 *  https://github.com/apigee-127/sway/blob/4c63138d93a47a151c31a636b11c6453c8a4c0a3/test/test-operation.js
 */

'use strict';

// Exposed methods
module.exports = {
  shouldBeAValidationError,
  shouldBeAnObjectMissingRequiredError,
  shouldBeAnInvalidRequestParameterError,
  shouldBeAMaxLengthError
};


/*
 * Given a validation error, it validates that it respects the schema
 *
 * @param error {Object}, Object to validate if it's a validation error.
 */
function shouldBeAValidationError (error) {
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
 * @param error {Object}, Object to validate if it's an invalid request para
 *                        -meter error.
 */
function shouldBeAnInvalidRequestParameterError (error) {
  error.should.have.property('code');
  error.should.have.property('errors');
  error.errors.should.be.an.Array();
  error.errors.length.should.be.above(0);
  error.code.should.be.equal('INVALID_REQUEST_PARAMETER');
}

/*
 * Given an missing property error, it validates that it respects the schema.
 *
 * @param error {Object}, Object to validate if it's an object missing required
 *                        property error.
 *
 * @param missingProperty {String}, the name of the missing property.
 */
function shouldBeAnObjectMissingRequiredError (error, missingProperty) {
  error.code.should.be.equal('OBJECT_MISSING_REQUIRED_PROPERTY');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.params.should.containEql(missingProperty);
}

/*
 * Given a Max Length property error, it validates that it respects the schema.
 *
 * @param error {Object}, Object to validate if it's a max length error.
 *
 * @param propertyInConflict {String}, the name of the missing property.
 */
function shouldBeAMaxLengthError (error, propertyInConflict) {
  error.code.should.be.equal('MAX_LENGTH');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.path.should.be.an.Array();
  error.path.length.should.be.above(0);
  error.path.should.containEql(propertyInConflict);
}
