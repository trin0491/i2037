#!/bin/bash
release="$1"

cd docker
./build-i2037-db.sh $release
./build-i2037-webapp.sh $release
cd ..

rm -Rf k8s/build

environments="local gcloud"
for environment in $environments
do
  buildDir="k8s/build/$environment" 
  mkdir -p $buildDir
  if [ $environment = "gcloud" ]
  then
    imagePrefix="eu.gcr.io/i2037-165621/"
    cp k8s/templates/i2037-lb.yaml $buildDir
  else 
    imagePrefix=""
  fi
  cp k8s/templates/i2037-pv1-$environment.yaml $buildDir/i2037-pv1.yaml
  
  templates="i2037-db i2037-webapp"
  for template in $templates
  do
    cp k8s/templates/$template.yaml $buildDir
    image="${template}"
    if [ $release ]
    then
      image="${image}:${release}"
    fi
    sed -i "" "s~__IMAGE__~${imagePrefix}${image}~g" "$buildDir/${template}.yaml"
  done
done
