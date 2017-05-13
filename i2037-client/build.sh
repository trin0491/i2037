#!/bin/sh
npm install
if [ "$#" -gt 0 ]
then
  TAG="i2037-db"
fi
npm version
grunt release
