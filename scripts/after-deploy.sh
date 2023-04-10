#!/bin/bash
REPOSITORY=/home/ubuntu/iot-server/build

cd $REPOSITORY

sudo /usr/bin/npm i
sudo /usr/bin/pm2 kill
sudo /usr/bin/pm2 start dist/main.js

