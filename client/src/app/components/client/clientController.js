/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client view Controller
 */

'use strict';

class clientController {
  constructor ($scope, clientService) {
    this.clientService = clientService;
    this.$scope = $scope;

    // Default list order
    this.listOrder = {
      column  : 'name',
      reverse : false
    }

    // Load the default form's configuration
    this.loadFormConfig();

    // Initialize
    this.loadClientList();

    // Load listeners
    $scope.$on('client-reload', this.loadClientList.bind(this));
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
    let fields = [
        {
          label       : 'Name',
          attribute   : 'name',
          type        : 'text',
          placeholder : 'Enter the client name..',
          required    : true,
          value       : (client? client.name : null)
        },{
          label       : 'Email',
          attribute   : 'email',
          type        : 'email',
          placeholder : 'Enter the client email..',
          required    : true,
          value       : (client? client.email : null)
        },{
          label       : 'Phone',
          attribute   : 'phone',
          type        : 'tel',
          placeholder : "Client phone: XXX-XXX-XXXX",
          required    : true,
          pattern     : "[0-9]{3}-[0-9]{3}-[0-9]{4}",
          value       : (client? client.phone : null)
        }
      ],
      title         = 'New Client',
      saveText      = 'Add Client',
      deleteVisible = false,
      providers     = [];

    if (mode === 'edit' && client != null) {
        title         = 'Edit Client';
        deleteVisible = true;
        saveText      = 'Save Client';
        providers     = client.providers.map( p => p.id );
    }

    this.form = {
      visible, title, mode, providers, fields,

      delete : {
        fn      : this.onDeleteClientClick.bind(this, client),
        text    : 'Delete Client',
        visible : deleteVisible
      },
      save   : {
        fn   : this.onClientSubmit.bind(this, client),
        text : saveText
      }
    };

    // Notify any widget that the form data is loaded
    this.$scope.$broadcast('form-loaded', this.form);
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
   * Submit the new client / client edition to the API by using the
   * clientService.
   *
   * @param client {Object}, the client instance to be added/edited.
   */
  onClientSubmit (client) {

    // If the client isn't set, initialize it to an empty object
    client = client || {};

    // Updates the client with all the form data.
    this.form.fields.forEach( field => {
      client[field.attribute] = field.value;
    });

    // Updates the client providers with the form data.
    client.providers = [];
    this.form.providers.forEach( id => {
      client.providers.push({ id });
    });

    if (this.form.mode === 'add') {
      this.clientService.createClient(client)
        .then(this.onClientSaveSuccess.bind(this))
        .catch(this.showError.bind(this));
    } else {
      this.clientService.updateClient(client)
        .then(this.onClientSaveSuccess.bind(this))
        .catch(this.showError.bind(this));
    }
  }

  /*
   * After the client is successfully saved, the client list needs to be
   * reloaded, and the form should be closed.
   */
  onClientSaveSuccess () {

    // Reload the client list
    this.loadClientList();

    // Close the form
    this.form.visible = false;
  }

  /*
   * Displays an error on a modal.
   */
  showError (error) {
    this.$scope.$emit('error', error);
  }
}

app.controller('clientController', [
  '$scope',
  'clientService',
  clientController
]);
