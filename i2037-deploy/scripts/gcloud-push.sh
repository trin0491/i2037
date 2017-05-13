#!/bin/bash
if [ "$#" -lt 1 ]
then
  echo "usage: $0 <image>"
  exit 1
fi
project_id=i2037-165621
image=$1

docker tag $image eu.gcr.io/$project_id/$image
gcloud docker -- push eu.gcr.io/$project_id/$image