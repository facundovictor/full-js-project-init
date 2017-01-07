# full-js-project-init
A web test using Node, Express, Swagger, Angular, Sequelize, MySQL

### Initial notes
So far, I'm building the initial structure using:
- NodeJS 7.4.0
- npm 4.0.5
- MySQL 5.6.30

### MySQL quick setup on Fedora

1. dnf install community-mysql-server
2. systemctl start mysqld.service
3. systemctl enable mysqld.service
4. /usr/bin/mysql_secure_installation
5. run the script ./scripts/create_mysql_user.sh
