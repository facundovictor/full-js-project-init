/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Communication service for managing the entity 'client'.
 */

'use strict';

class ClientService {
  constructor ($http, appConfig) {
    this.$http = $http;
    this.appConfig = appConfig
  }

  /*
   * Recover all the clients by requesting 'GET /api/client'
   *
   * @return {Promise}, The promise of the list of clients.
   */
  getAllClients () {
    return this.$http
      .get(`${this.appConfig.apiUrl}/api/client`)
      .then( response => {
        if (response.status === 200)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }
}

app.service('clientService', [
  '$http',
  'appConfig',
  ClientService
]);
