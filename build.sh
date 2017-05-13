#!/bin/sh
RELEASE=1.0.1
cd i2037-client
./build.sh
cd ../i2037-webapp
./build.sh
cd ../i2037-deploy
./build.sh $RELEASE
