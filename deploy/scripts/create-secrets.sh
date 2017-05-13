#!/bin/bash
if [ "$#" -lt 3 ]
then
  echo "usage: $0 <root_pass> <db_pass> <salt>"
  exit 1
fi
kubectl create secret generic i2037-db-root-pass --from-literal=password=$1
kubectl create secret generic i2037-db-user-pass --from-literal=password=$2
kubectl create secret generic i2037-webapp-salt --from-literal=salt=$3