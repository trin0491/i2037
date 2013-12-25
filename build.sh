#!/bin/sh
npm install -g grunt-cli
cd i2037-client
npm install
grunt release
cd ../i2037-webapp
mvn clean
mvn install