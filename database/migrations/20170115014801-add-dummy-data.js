/*
 * Author      : Facundo Victor <facundovt@gmail.com>
 * Description : Add dummy data for using on the API development.
 */

'use strict';

// Reference : https://github.com/sequelize/umzug#getting-all-pending-migrations
module.exports = {
  up: function (db, queryInterface) {
    return new Promise((resolve, reject) => {
      let sql = `
        INSERT INTO client(name, email, phone) VALUES
            ('Client 1', 'client1@gmail.com', '+54-9291-4444441'),
            ('Client 2', 'client2@gmail.com', '+54-9291-4444442'),
            ('Client 3', 'client3@gmail.com', '+54-9291-4444443'),
            ('Client 4', 'client4@gmail.com', '+54-9291-4444444'),
            ('Client 5', 'client5@gmail.com', '+54-9291-4444445'),
            ('Client 6', 'client6@gmail.com', '+54-9291-4444446'),
            ('Client 7', 'client7@gmail.com', '+54-9291-4444447'),
            ('Client 8', 'client8@gmail.com', '+54-9291-4444448');

        INSERT INTO provider(name) VALUES
            ('Provider 1'),
            ('Provider 2'),
            ('Provider 3'),
            ('Provider 4'),
            ('Provider 5');

        INSERT INTO client_provider(client_id, provider_id) VALUES
            (1,1), (1,2), (1,3),
            (2,2), (2,3),
            (3,3),
            (4,1), (4,4),
            (7,5);
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
        DELETE FROM client;
        DELETE FROM provider;
        DELETE FROM client_provider;

        /* The clinet_provider table uses absolute values for the ids. Thus,
         * the auto_increment value needs to be restored back to 1.
         */
        ALTER TABLE client AUTO_INCREMENT = 1;
        ALTER TABLE provider AUTO_INCREMENT = 1;
      `;
      db.transaction((transaction) => {
        return db.query(sql, {transaction})
      }).then((results) => resolve(results))
        .catch((error)  => reject(error));
    });
  }
};
