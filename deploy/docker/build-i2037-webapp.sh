#!/bin/bash
export VERSION=1.0.3
cp ../../i2037-webapp/build/libs/i2037-webapp-${VERSION}-SNAPSHOT.war ./i2037-webapp/i2037-webapp.war
docker build -t i2037-webapp:${VERSION} i2037-webapp
