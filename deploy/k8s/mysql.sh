#!/bin/bash
pod=`kubectl get pods -l tier=db -o 'jsonpath={.items[*].metadata.name}'`
kubectl exec $pod -it -- /usr/local/mysql/bin/mysql -p
