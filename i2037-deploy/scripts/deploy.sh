#!/bin/bash
if [ "$#" -lt 1 ]
then
  echo "usage: $0 <local|gcloud>"
  exit 1
fi
environment=$1
configDir="../k8s/build/$environment"

kubectl apply -f $configDir
