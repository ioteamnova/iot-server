#!/bin/bash
REPOSITORY=/home/ubuntu/iot-server/build

cd $REPOSITORY

npm i
pm2 kill
pm2 start dist/main.js

