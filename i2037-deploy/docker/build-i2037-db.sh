#!/bin/bash
if [ "$#" -lt 1 ]
then
  TAG="i2037-db"
else
  TAG="i2037-db:$1"
fi
docker build -t $TAG i2037-db
