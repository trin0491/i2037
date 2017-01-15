#!/bin/bash
cp ../../i2037-webapp/build/libs/i2037-webapp-1.0.0-SNAPSHOT.war ./i2037-webapp
docker build -t i2037-webapp:1.0.0 i2037-webapp
