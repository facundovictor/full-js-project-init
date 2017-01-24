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

    // Default list order
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
   * Deletes the client at the position 'index' and identified by the client_id.
   *
   * @param client_id {Number}, The client identifier.
   * @param index {Number}, the client's position on the list.
   */
  deleteClient (client_id, index) {
    this.clientService.deleteClient(client_id).then(() => {
      this.clients.splice(index, 1);
    }).catch(this.showError.bind(this));
  }

  /*
   * It sorts the list by the passed column, if the list is already sorted by
   * the passed column, it reverts the order.
   *
   * @param column {String}, name of the column to sort by.
   */
  setOrderBy (column) {
    let order = this.listOrder;
    if (order.column === column) {
      order.reverse = !order.reverse;
    } else {
      order.column  = column;
      order.reverse = false;
    }
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
