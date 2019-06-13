#!/bin/sh
docker rm -f $(docker ps -aq);
docker rmi -f $(docker images | grep ehrcontract | awk '{print $3}')
