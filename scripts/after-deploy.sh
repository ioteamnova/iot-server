#!/bin/bash
REPOSITORY=/home/ubuntu/iot-server/build

cd $REPOSITORY

sudo npm i
sudo pm2 kill
sudo pm2 start dist/main.js

