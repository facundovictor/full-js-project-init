/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Communication service for managing the entity 'provider'.
 */

'use strict';

class ProviderService {
  constructor ($http, appConfig) {
    this.$http = $http;
    this.appConfig = appConfig;
  }

  /*
   * Recover all the providers by requesting 'GET /api/provider'
   *
   * @return {Promise}, The promise of the list of providers.
   */
  getAllProviders () {
    return this.$http
      .get(`${this.appConfig.apiUrl}/api/provider`)
      .then( response => {
        if (response.status === 200)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }

  /*
   * Deletes the provider identified by the id. 'DELETE /api/provider/{id}'
   *
   * @param id {Number}, the provider's identifier.
   *
   * @return {Promise}, The promise of the delete action.
   */
  deleteProvider (id) {
    return this.$http
      .delete(`${this.appConfig.apiUrl}/api/provider/${id}`)
      .then( response => {
        if (response.status === 204)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }

  /*
   * Creates a new provider. 'POST /api/provider/'
   *
   * @param provider {Object}, the provider's data.
   *
   * @return {Promise}, The promise of the created provider.
   */
  createProvider (provider) {
    return this.$http
      .post(`${this.appConfig.apiUrl}/api/provider/`, provider)
      .then( response => {
        if (response.status === 201)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }

  /*
   * Updates an existent provider. 'PUT /api/provider/{id}'
   *
   * @param provider {Object}, the provider's data.
   *
   * @return {Promise}, The promise of the updated provider.
   */
  updateProvider (provider) {
    return this.$http
      .put(`${this.appConfig.apiUrl}/api/provider/${provider.id}`, provider)
      .then( response => {
        if (response.status === 200)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }
}

app.service('providerService', [
  '$http',
  'appConfig',
  ProviderService
]);
