#!/bin/bash
if [ "$#" -lt 1 ]
then
  echo "usage: $0 <root_pass>"
  exit 1
fi
kubectl run -it --rm --image=mysql:5.6 mysql-client -- mysql -h i2037-db -p$1
