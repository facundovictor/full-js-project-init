/*
 * Author      : Facundo Victor <facundovt@gmail.com>
 * Description : This is the first migration script for creating the tables for
 *               client, provider, and the many-to-many relationship between
 *               them.
 */

'use strict';

// Reference : https://github.com/sequelize/umzug#getting-all-pending-migrations
module.exports = {
  up: function (db, queryInterface) {
    return new Promise((resolve, reject) => {
      let sql = `
        CREATE TABLE client (
          id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name  VARCHAR(50) NOT NULL,
          email VARCHAR(50) NOT NULL,
          phone VARCHAR(50) NOT NULL,

          PRIMARY KEY (id)
        );

        CREATE TABLE provider (
          id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(50) NOT NULL,

          PRIMARY KEY (id)
        );

        CREATE TABLE client_provider (
          client_id   INT UNSIGNED NOT NULL,
          provider_id INT UNSIGNED NOT NULL,

          PRIMARY KEY (client_id, provider_id),
          FOREIGN KEY (client_id)   REFERENCES client   (id) ON DELETE CASCADE,
          FOREIGN KEY (provider_id) REFERENCES provider (id) ON DELETE CASCADE
        );
      `;
      db.transaction((transaction) => {
        return db.query(sql, {transaction})
      }).then((results) => resolve(results))
        .catch((error)  => reject(error));
    });
  },

  // Create the revert function whenver possible
  down: function (db, queryInterface) {
    return new Promise((resolve, reject) => {
      let sql = `
        DROP TABLE client_provider, provider, client;
      `;
      db.transaction((transaction) => {
        return db.query(sql, {transaction})
      }).then((results) => resolve(results))
        .catch((error)  => reject(error));
    });
  }
};
