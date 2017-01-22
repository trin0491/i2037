#!/bin/bash
kubectl run -it --rm --image=mysql:5.6 mysql-client -- mysql -h i2037-db -pmysecret
