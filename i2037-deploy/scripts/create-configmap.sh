#!/bin/bash
if [ "$#" -lt 1 ]
then
  echo "usage: $0 <dir>"
  exit 1
fi
kubectl create configmap i2037-webapp --from-file=$1