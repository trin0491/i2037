#!/bin/bash
if [ "$#" -lt 2 ]
then
  echo "usage: $0 <root_pass> <db_pass>"
  exit 1
fi
kubectl create secret generic i2037-db-root-pass --from-literal=password=$1
kubectl create secret generic i2037-db-pass --from-literal=password=$2
