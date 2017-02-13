/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Provider Controller
 */

'use strict';

class providerController {
  constructor ($scope, providerService) {
    this.providerService = providerService;
    this.$scope = $scope;

    // Load listeners
    this.$scope.$on('form-loaded', this.loadSelectedProviders.bind(this));

    // Initialize
    this.loadProviderList();
  }

  /*
   * Gets the list of providers from the server and loads it on the view.
   */
  loadProviderList () {
    this.providerService.getAllProviders().then( providers => {
      this.providers = providers;
    }).catch(this.showError.bind(this));
  }

  /*
   * When the form is loaded with the client providers, it checks the providers
   * that the client already has assigned.
   *
   * @param event {Event}, the 'form-loaded' event object.
   * @param form {Object}, the form configuration and data.
   */
  loadSelectedProviders (event, form) {
    // Retrieve the id list of selected provider
    let selected = form.providers;

    // Set the checked status to the selected providers
    this.providers.forEach( provider => {
      if (selected.indexOf(provider.id) !== -1)
        provider.checked = true;
      else
        provider.checked = false;
    });

    // Saves the reference to the form
    this.form = form;
  }

  /*
   * Deletes the provider on the server and removes it from the list of pro
   * -viders, and reloads the client list.
   *
   * @param provider {Object}, The provider to be removed.
   */
  onDeleteProviderClick (provider) {
    this.providerService.deleteProvider(provider.id).then(() => {
      this.providers.splice(this.providers.indexOf(provider), 1);

      // If the provider was checked, remove it from checked list
      if (provider.checked) {
        let selected = this.form.providers;
        selected.splice(selected.indexOf(provider.id), 1);
      }

      // Ask the parent to reload
      this.$scope.$emit('client-reload');
    }).catch(this.showError.bind(this));
  }

  /*
   * Adds a new provider on the server and loads it into the list.
   *
   * @param providerName {String}, The name of the new provider.
   */
  onAddProviderClick (providerName) {
    if (providerName) {
      this.providerService.createProvider({
        name : providerName
      }).then( provider => {
        this.providers.push(provider);
      }).catch(this.showError);
    }
  }

  /*
   * Marks or unmarks the provider to be added to the client.
   *
   * @param provider {Object}, The provider checked/unchecked.
   */
  onProviderCheckChanged (provider) {
    let selected = this.form.providers;

    // If the provider is checked, add it if it's not exists
    if (!provider.checked)
      selected.splice(selected.indexOf(provider.id), 1);
    else if (selected.indexOf(provider.id) === -1)
      selected.push(provider.id);
  }

  /*
   * Given a target provider to be edited, it disables the edition mode to
   * all the providers, and enables it for the target.
   *
   * @param providerToEdit {Object}, The provider to be edited.
   */
  startProviderEdition (providerToEdit) {

    // If there was another provider being edited, restore it.
    if (this.providerOnEdition && this.providerOnEdition.editOn)
      this.cancelEdition(this.providerOnEdition);

    // Saves the provider that's going to be edited
    this.providerOnEdition = providerToEdit;

    // Saves the old value
    this.oldValue = providerToEdit.name;

    // Enable edition only for the targeted provider
    this.providers.forEach( provider => {
      if (providerToEdit !== provider)
        provider.editOn=false;
      else
        provider.editOn=true;
    });
  }

  /*
   * Given a provider, it clears the edition status, and it restore its value
   * to the latest value.
   *
   * @param provider {Object}, the provider to be restored to the initial state
   */
  cancelEdition (provider) {
    // Restore the provider state
    Object.assign(provider, {
      name   : this.oldValue,
      editOn : false
    });

    // Clear the current provider reference
    this.providerOnEdition = null;
  }

  /*
   * Saves the edited provider in the back-end and notifies the changes to the
   * client.
   *
   * @param provider {Object}, the provider to be edited.
   */
  saveEditedProvider (provider) {
    if (provider.name) {
      this.providerService.updateProvider(provider).then( updated_provider => {

        // Save the changes to the current object (And persist the checked state)
        Object.assign(provider, {
          name   : updated_provider.name,
          editOn : false
        });

        // Ask the parent to reload
        this.$scope.$emit('client-reload');
      }).catch( error => {
        this.cancelEdition(provider);
        this.showError.call(this, error);
      });
    }
  }

  /*
   * Displays an error on a modal.
   */
  showError (error) {
    this.$scope.$emit('error', error);
  }
}

app.controller('providerController', [
  '$scope',
  'providerService',
  providerController
]);
