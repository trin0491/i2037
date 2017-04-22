#!/bin/sh
cd i2037-client
npm install
grunt release
cd ../i2037-webapp
./gradlew build
cd ../deploy/docker
./build-i2037-webapp.sh
./build-i2037-db.sh