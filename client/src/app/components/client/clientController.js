/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client view Controller
 */

'use strict';

class clientController {
  constructor (clientService, appConfig) {
    this.clientService = clientService;
    this.appConfig = appConfig;

    this.listOrder = {
      column  : 'name',
      reverse : false
    }

    // Initialize
    this.loadClientList();
  }

  /*
   * Gets the list of clients from the server and loads it on the view.
   */
  loadClientList () {
    this.clientService.getAllClients().then( clients => {
        this.clients = clients;
    }).catch(this.showError.bind(this));
  }

  /*
   * Displays an error on a modal.
   * TODO: Move this to a base controller.
   */
  showError (error) {
    if (error.status <= 0 )
        error.message = "Can't connect to the server.";

    console.log(error);
    this.error = {
      visible : true,
      title   : 'Error',
      message : error.message
    };
  }

  editClient (message) {
    alert(message);
  }
}

app.controller('clientController', [
  'clientService',
  clientController
]);
