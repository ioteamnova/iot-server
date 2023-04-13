#!/bin/bash
cd /home/ubuntu/iot-server/build

git pull
npm i
npm run build
pm2 kill
pm2 start dist/main.js

