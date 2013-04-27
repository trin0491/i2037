#!/bin/bash
BUILD_HOME=`dirname $0`
rsync -avz --delete $BUILD_HOME/app/ merlin:/srv/www/i2037/htdocs