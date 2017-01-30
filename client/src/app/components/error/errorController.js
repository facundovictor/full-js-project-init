/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Modal error Controller
 */

class errorController {
  constructor ($scope) {

    // Initialize the error data structure
    Object.assign(this, {
      visible : true,
      title   : 'Error',
      message : ''
    });

    // Initialize the event listener
    $scope.$on('error', this.showError.bind(this));
  }

  /*
   * Displays an error on a modal.
   *
   * @param event {Event} , the error Event.
   * @param error {Object} , the triggered error.
   */
  showError (event, error) {
    let message = 'Unknown error';

    if (error.data)
      message = error.data.message;

    if (error.status <= 0 )
      message = "Can't connect to the server.";

    console.log(message, error);
    Object.assign(this, {
      visible : true,
      message
    });
  }
}

app.controller('errorController', [
  '$scope',
  errorController
]);
