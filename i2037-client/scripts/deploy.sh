#!/bin/bash
#BUILD_HOME=/var/lib/jenkins/jobs/i2037/lastStable/archive
BUILD_HOME=`dirname $0`/..
rsync -avz --delete $BUILD_HOME/app/ /srv/www/i2037/htdocs
