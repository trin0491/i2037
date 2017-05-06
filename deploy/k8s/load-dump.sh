#!/bin/bash
if [ "$#" -lt 2 ]
then
  echo "usage: $0 <password> <file>"
  exit 1
fi
pod=`kubectl get pods -l tier=db -o 'jsonpath={.items[*].metadata.name}'`
kubectl exec -i $pod -- /usr/local/mysql/bin/mysql -D i2037 -p$1 < $2
