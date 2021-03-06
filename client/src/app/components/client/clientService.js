/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Communication service for managing the entity 'client'.
 */

'use strict';

class ClientService {
  constructor ($http, appConfig) {
    this.$http = $http;
    this.appConfig = appConfig;
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

  /*
   * Deletes the client identified by the id. 'DELETE /api/client/{id}'
   *
   * @param id {Number}, the client's identifier.
   *
   * @return {Promise}, The promise of the delete action.
   */
  deleteClient (id) {
    return this.$http
      .delete(`${this.appConfig.apiUrl}/api/client/${id}`)
      .then( response => {
        if (response.status === 204)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }

  /*
   * Creates a new client. 'POST /api/client/'
   *
   * @param client {Object}, the client's data.
   *
   * @return {Promise}, The promise of the created client.
   */
  createClient (client) {
    return this.$http
      .post(`${this.appConfig.apiUrl}/api/client/`, client)
      .then( response => {
        if (response.status === 201)
          return response.data;
        throw new Error(`Reponse with status ${response.status}`);
      });
  }

  /*
   * Updates an existent client. 'PUT /api/client/{id}'
   *
   * @param client {Object}, the client's data.
   *
   * @return {Promise}, The promise of the updated client.
   */
  updateClient (client) {
    return this.$http
      .put(`${this.appConfig.apiUrl}/api/client/${client.id}`, client)
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
