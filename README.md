# full-js-project-init
A web test using Node, Express, Swagger, Angular, Sequelize, MySQL

### Initial notes
So far, I'm building the initial structure using:
- NodeJS 7.4.0
- npm 4.0.5
- MySQL 5.6.30

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
