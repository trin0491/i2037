#!/bin/bash
kubectl run -it --rm --image=mysql:5.5 mysql-client -- mysql -h i2037-db -D i2037 -p
