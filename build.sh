#!/bin/sh
cd i2037-client
npm install
grunt release
cd ../i2037-webapp
gradlew build