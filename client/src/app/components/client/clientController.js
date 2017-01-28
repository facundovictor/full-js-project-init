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

    // Load the default form's configuration
    this.loadFormConfig();

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
   * Deletes the client on the server and removes it from the list.
   *
   * @param client {Object}, The client to be removed.
   */
  onDeleteClientClick (client) {
    this.clientService.deleteClient(client.id).then(() => {
      this.clients.splice(this.clients.indexOf(client), 1);
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
   * Load the form's configuration.
   *
   * @param mode    {String},  form mode (can be 'add' or 'edit')
   * @param visible {Boolean}, True if the form should become visible, False
   *                           otherwise.
   * @param client  {Object},  Client instance to be edited (only used if mode
   *                           is equal to 'edit')
   */
  loadFormConfig (mode = 'add', visible, client) {
    let fields = [{
          label       : 'Field 1',
          type        : 'text',
          placeholder : 'Some placeholder to be used on the input',
          value       : 'Input value',
        },{
          label       : 'Field 1',
          type        : 'text',
          placeholder : 'Some placeholder to be used on the input',
          value       : 'Input value'
        }],
        title         = 'New Client',
        saveText      = 'Add Client',
        deleteVisible = false;

    if (mode === 'edit' && client != null) {
        title = 'Edit Client';
        deleteVisible = true;
    }

    this.form = {
      visible, title, mode, fields,

      delete : {
        fn      : this.onDeleteClientClick.bind(this, client),
        text    : 'Delete Client',
        visible : deleteVisible
      },
      save   : {
        fn   : () => {console.log('SAVING');},
        text : saveText
      }
    };
  }

  /*
   * Open the form in 'add' mode
   */
  onNewClientClick () {
    this.loadFormConfig('add', true);
  }

  /*
   * Open the form in 'edit' mode and loads the client data
   *
   * @param client {Object}, the client instance to be edited.
   */
  onEditClientClick (client) {
    this.loadFormConfig('edit', true, client);
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
}

app.controller('clientController', [
  'clientService',
  clientController
]);
