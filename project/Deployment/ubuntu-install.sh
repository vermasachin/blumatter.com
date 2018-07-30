#! /bin/bash

# Assuming installation on ubuntu-aws-ec2 machine
sudo apt-get update

# Install Node.js
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Get code
git clone https://satyashani@bitbucket.org/satyashani/blumatter.git

# Get DB
sudo apt-get install postgresql-9.5
sudo chmod 777 /etc/postgresql/9.5/main/pg_hba.conf
sudo echo "host    all             all             0.0.0.0/0               md5" >> /etc/postgresql/9.5/main/pg_hba.conf
sudo echo "host    all             all             0.0.0.0/0               md5" >> /etc/postgresql/9.5/main/pg_hba.conf
sudo chmod 640 /etc/postgresql/9.5/main/pg_hba.conf
sudo service postgresql restart
sudo su postgres
echo "CREATE USER 'xadmin' PASSWORD 'rewq12';" > /tmp/create.sql
echo "CREATE SCHEMA blumatter;" >> /tmp/create.sql
psql < /tmp/create.sql
psql < blumatter/project/core/models/create.sql
exit
cd blumatter/project
sudo npm install
sudo npm install -g mocha forever
sudo forever app.js > access.log 2> error.log &
