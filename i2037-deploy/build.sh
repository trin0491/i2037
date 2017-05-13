#!/bin/sh
if [ "$#" -lt 0 ]
then
  RELEASE=""
else
  RELEASE="$1"
fi
cd docker
./build-i2037-webapp.sh $RELEASE
./build-i2037-db.sh $RELEASE
