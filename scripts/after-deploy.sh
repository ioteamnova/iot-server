#!/bin/bash
REPOSITORY=/home/ubuntu/iot-server/build

cd $REPOSITORY
npm i pm2 -g
pm2 reload main