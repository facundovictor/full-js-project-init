#!/bin/env bash
#
# @author facundovictor <facundovt@gmai.com>
#
# For a MySQL quick setup on Fedora:
#   1. dnf install community-mysql-server
#   2. systemctl start mysqld.service
#   3. systemctl enable mysqld.service
#   4. /usr/bin/mysql_secure_installation
#
###############################################################################

# Configuration ---------------------------------------------------------------
USER="root"
DB="web_development"
DB_USER="web_user"
DB_PASS="web.."
CLIENT_HOST="localhost"
# -----------------------------------------------------------------------------

# binaries --------------------------------------------------------------------
MYSQL=$(which mysql)
# -----------------------------------------------------------------------------

# Functions -------------------------------------------------------------------

# show_help:
#       Prints a tiny help to stdout.
function show_help {
    echo ''
    echo -e "\e[4mScript '\e[32m$0\e[24m'\e[39m"
    echo ''
    echo "          $0 [-h]"
    echo ''
    echo -e "The script creates the database '\e[33m$DB\e[39m, the user \
'\e[33m$DB_USER\e[39m, and grant privileges on the database to user from \
'\e[33m$CLIENT_HOST\e[39m'."
    echo ''
    echo -e '\e[4mArguments:\e[24m'
    echo '        -h --> Shows this help.'
    echo ''
}

# create_database_and_user:
#       It connects to the mysql server using the $USER and asks for a password
#       It creates the database if it doesn't exist, creates the user if it
#       doesn't exist, and finally, it grant database privileges to the user. 
function create_database_and_user {
$MYSQL -u $USER -p -t <<EOF

/* Create the database */
CREATE DATABASE IF NOT EXISTS $DB;

/* Create the user */
CREATE USER '$DB_USER'@'$CLIENT_HOST' IDENTIFIED BY '$DB_PASS';

/* Grant permission to the user */
GRANT ALL ON $DB.* TO '$DB_USER'@'$CLIENT_HOST';

/* Reload the grant tables */
FLUSH PRIVILEGES;

EOF
}

# MAIN ------------------------------------------------------------------------

if [ "$1" == "-h" ] ; then
    show_help;
else
    create_database_and_user;
fi
