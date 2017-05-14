#!/bin/sh
release=$1

projects="i2037-client i2037-webapp i2037-deploy"
for project in $projects
do
  cd $project
  ./build.sh $release
  cd ..
done
