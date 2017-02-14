# full-js-project-init
A web test using Node, Express, Swagger, Angular, Sequelize, MySQL

### Content
- [Initial Notes](https://github.com/facundovictor/full-js-project-init#initial-notes)
- [Project directory strcture](https://github.com/facundovictor/full-js-project-init#project-directory-structure)
- [NPM Scripts](https://github.com/facundovictor/full-js-project-init#npm-scripts)
- [Database Migrations](https://github.com/facundovictor/full-js-project-init#database-migrations)
- [MySQL quick stup on fedora](https://github.com/facundovictor/full-js-project-init#mysql-quick-setup-on-fedora)

### Initial notes
So far, I'm building the initial structure using:
- NodeJS 7.4.0
- npm 4.2.0
- MySQL 5.6.30

### Project directory structure

Structure in development..

```
project
|   README.md
|   package.json
|
└───api
|   |   app.js
|   |
|   └───config
|   |   |   default.json
|   |
|   └───swagger
|   |   |   swagger.yaml
|   |
|   └───middleware
|   |   |   cors.js
|   |
|   └───models
|   |   |   index.js
|   |   |   client.js
|   |   |   provider.js
|   |   |   clientprovider.js
|   |
|   └───controllers
|   |   |   client.js
|   |   |   provider.js
|   |
|   └───mocks
|   |   └───controllers
|   |   |   |   client.js
|   |   |   |   provider.js
|   |
|   └───test
|       └───controllers
|       |   |   client.js
|       |   |   provider.js
|       |
|       └───helpers
|           |   error_validations.js
|
└───client
|   |   gulpfile.js
|   |
|   └───public
|   |
|   └───src
|   |   └───app
|   |   |   |   index.html
|   |   |   |   app.js
|   |   |   |
|   |   |   └───components
|   |   |   |   | 
|   |   |   |   └───client
|   |   |   |   |   |   clientController.js
|   |   |   |   |   |   clientService.js
|   |   |   |   |   |   clientView.html
|   |   |   |   |
|   |   |   |   └───error
|   |   |   |   |   |   errorController.js
|   |   |   |   |   |   errorDirective.js
|   |   |   |   |   |   errorView.html
|   |   |   |   |
|   |   |   |   └───provider
|   |   |   |       |   providerController.js
|   |   |   |       |   providerDirective.js
|   |   |   |       |   providerFormView.html
|   |   |   |       |   providerService.js
|   |   |   |
|   |   |   └───shared
|   |   |       └───filters
|   |   |       |   providerListNameFilter.js
|   |   |       |
|   |   |       └───modalForm
|   |   |           |   modalFormDirective.js
|   |   |           |   modalFormView.html
|   |   |
|   |   └───assets
|   |   |   └───lib
|   |   |       |   jquery.min.js
|   |   |       |
|   |   |       └───angular
|   |   |       └───bootstrap
|   |   |       └───font-awesome
|   |   |
|   |   └───scss
|   |       |   all.scss
|   |       |   variables.scss
|   |       |
|   |       └───ux
|   |       |   |   list.scss
|   |       |   |   button.scss
|   |       |   |   input.scss
|   |       |   |   toolbar.scss
|   |       |   |
|   |       |   └───modal
|   |       |       |   modal.scss
|   |       |       |   modalError.scss
|   |       |       |   modalForm.scss
|   |       |
|   |       └───components
|   |           |   providerForm.scss
|   |
|   |
|   └───test
|       |   protractor.config.js
|       |
|       └───client
|       |   |   creation.js
|       |   |   delete.js
|       |   |   edition.js
|       |   |   view.js
|       └───provider
|           |   creation.js
|           |   delete.js
|           |   edition.js
|           |   view.js
|
└───scripts
|   |   create_mysql_user.sh
|
└───database
    |   config.json
    |   migration.js
    |
    └───migrations
        |   20170112165345-database-init.js
        |   20170115014801-add-dummy-data.js
```

### Scripts

* Build front-end SPA: `npm run build`
* Start developing the front-end SPA with browser auto-reload: `npm run dev`
* Start the webdriver: `npm run webdriver`
* Running the front-end tests: `npm run test-client`
* Start the webdrvier and run the tests: `npm run start-webdriver-and-test`
* Build the SPA, start the webdriver, run tests and stop the webdriver: `npm run build-and-test`
* Running the server: `npm run server`
* Running the mock server: `npm run mock-server`
* Running the server in debug mode: `npm run debug`
* Edit the API specifications: `npm run edit`  ( This will open the default browser with the swagger editor ).
* Run the tests with Swagger mocked mode: `npm run test`
* Run the integration tests with real data: `npm run test-integration`
* Run migrations: Please read the below description ↓

### Database Migrations

For running migrations, the script to use is `npm run migration`:

```
  Usage: npm run migration [options]

  Options:

    -h, --help              output usage information
    -u, --up [migration]    Execute all migrations up to the specified one. If it's not specified, then execute it up to the newest one
    -d, --down [migration]  Undo all migrations down to the specified one. If it's not specified, then rever only the latest migration
    -n, --new               Generate a new migration
    -e, --executed          List the already executed migrations
    -p, --pending           List all pending migrations (Default behavior)
    -v, --verbose           Show more information on the stdout
```

Here some examples:

* For showing the pending migrations : `npm run migration -- --pending` or `npm run migration -- -p`
* For showing the executed migrations : `npm run migration -- --executed` or `npm run migration -- -e`
* For creating a new migration file : `npm run migration -- --new` or `npm run migration -- -n`
* For reverting the last migration : `npm run migration -- --down` or `npm run migration -- -d`
* For reverting all migrations down to `migration-file.js` : `npm run migration -- --down migration-file.js` or `npm run migration -- -d migration-file.js`
* For executing all the pending migrations : `npm run migration -- --up` or `npm run migration -- -u`
* For executing all migrations up to `migration-file.js` : `npm run migration -- --up migration-file.js` or `npm run migration -- -u migration-file.js`

### MySQL quick setup on Fedora

1. dnf install community-mysql-server
2. systemctl start mysqld.service
3. systemctl enable mysqld.service
4. /usr/bin/mysql_secure_installation
5. run the script ./scripts/create_mysql_user.sh
