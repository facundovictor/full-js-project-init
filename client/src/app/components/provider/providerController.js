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

    // Save the reference
    // TODO: Do it trhough event comunication
    this.parentScope = $scope.$parent.vm;

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
   * Deletes the provider on the server and removes it from the list of pro
   * -viders, and reloads the client list.
   *
   * @param provider {Object}, The provider to be removed.
   */
  onDeleteProviderClick (provider) {
    this.providerService.deleteProvider(provider.id).then(() => {
      this.providers.splice(this.providers.indexOf(provider), 1);

      this.parentScope.loadClientList();
    }).catch(this.showError.bind(this));
  }

  /*
   * Adds a new provider on the server and loads it into the list.
   *
   * @param providerName {String}, The name of the new provider.
   */
  onAddProviderClick (providerName) {
    this.providerService.createProvider({
      name : providerName
    }).then( provider => {
      this.providers.push(provider);
    }).catch(this.showError);
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
