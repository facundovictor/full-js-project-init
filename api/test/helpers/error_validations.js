
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
  shouldBeAListOfObjectMissingRequiredErrors,
  shouldBeAnInvalidFormatError,
  shouldBeAMaxLengthError,
  shouldBeAMinLengthError,
  shouldBeAPatternError
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
 * Given a list of missing property errors, it validates that it respects the
 * schema.
 *
 * @param errors {Array}, Array of Objectes to be validated if they are missing
 *                        required property error.
 *
 * @param missingProperties {Array}, the name list of the missing properties.
 */
function shouldBeAListOfObjectMissingRequiredErrors (errors, missingProperties) {
  errors.should.be.an.Array();
  errors.length.should.be.above(0);
  missingProperties.should.be.an.Array();
  missingProperties.length.should.be.above(0);
  errors.length.should.be.equal(missingProperties.length);

  let listOfMissingParams = errors.map( error => {
    error.code.should.be.equal('OBJECT_MISSING_REQUIRED_PROPERTY');
    error.params.should.be.an.Array();
    error.params.length.should.be.equal(1);
    return error.params[0];
  });

  missingProperties.should.containDeep(missingProperties);
}

/*
 * Given a Max Length property error, it validates that it respects the schema.
 *
 * @param error {Object}, Object to validate if it's a max length error.
 *
 * @param propertyInConflict {String}, the name of the property in conflict.
 */
function shouldBeAMaxLengthError (error, propertyInConflict) {
  error.code.should.be.equal('MAX_LENGTH');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.path.should.be.an.Array();
  error.path.length.should.be.above(0);
  error.path.should.containEql(propertyInConflict);
}

/*
 * Given a Min Length property error, it validates that it respects the schema.
 *
 * @param error {Object}, Object to validate if it's a min length error.
 *
 * @param propertyInConflict {String}, the name of the property in conflict.
 */
function shouldBeAMinLengthError (error, propertyInConflict) {
  error.code.should.be.equal('MIN_LENGTH');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.path.should.be.an.Array();
  error.path.length.should.be.above(0);
  error.path.should.containEql(propertyInConflict);
}

/*
 * Given a pattern check error, it validates that it respects the schema.
 *
 * @param error {Object}, Object to validate if it's a pattern check error.
 *
 * @param propertyInConflict {String}, the name of the wrong property.
 */
function shouldBeAPatternError (error, propertyInConflict) {
  error.code.should.be.equal('PATTERN');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.path.should.be.an.Array();
  error.path.length.should.be.above(0);
  error.path.should.containEql(propertyInConflict);
}

/*
 * Given an Invalid Format error, it validates that it respects the schema.
 *
 * @param error {Object}, Object to validate if it's an "Invalid format" error.
 *
 * @param propertyInConflict {String}, the name of the wrong property.
 */
function shouldBeAnInvalidFormatError (error, propertyInConflict) {
  error.code.should.be.equal('INVALID_FORMAT');
  error.params.should.be.an.Array();
  error.params.length.should.be.above(0);
  error.path.should.be.an.Array();
  error.path.length.should.be.above(0);
  error.path.should.containEql(propertyInConflict);
}
