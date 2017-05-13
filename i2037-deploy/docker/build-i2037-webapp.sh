#!/bin/bash
if [ "$#" -lt 1 ]
then
  TAG="i2037-webapp"
else
  TAG="i2037-webapp:$1"
fi
cp ../../i2037-webapp/build/libs/i2037-webapp.war ./i2037-webapp/i2037-webapp.war
docker build -t $TAG i2037-webapp
