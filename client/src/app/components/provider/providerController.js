/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Provider Controller
 */

'use strict';

class providerController {
  constructor ($scope, providerService, appConfig) {
    this.providerService = providerService;
    this.appConfig = appConfig;

    // Save the reference
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
    }).catch(this.showError);
  }

  /*
   * Deletes the provider on the server and removes it from the list.
   *
   * @param provider {Object}, The provider to be removed.
   */
  onDeleteProviderClick (provider) {
    this.providerService.deleteProvider(provider.id).then(() => {
      this.providers.splice(this.providers.indexOf(provider), 1);
    }).catch(this.showError);
  }

  /*
   * Displays an error on a modal.
   * TODO: Move this to a base controller.
   */
  showError (error) {
    this.parentScope.showError(error);
  }
}

app.controller('providerController', [
  '$scope',
  'providerService',
  providerController
]);
