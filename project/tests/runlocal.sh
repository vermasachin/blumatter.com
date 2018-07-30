#!/bin/bash
cd /var/www/blumatter
export ENV=local
#make -f alltests unit

nodejs app.js > nodetestaccess.log 2> nodetesterror.log &
echo "Waiting 5 seconds for web service to start"
sleep 5
cd tests/
make -f alltests api
lsof -i tcp:3000 | awk 'NR!=1 {print $2}' | xargs kill 
cd ../..
rm nodetestaccess.log
rm nodetesterror.log
