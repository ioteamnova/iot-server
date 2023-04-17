#!/bin/bash
cd /home/ubuntu/iot-server/build


pm2 kill
pm2 start dist/main.js

