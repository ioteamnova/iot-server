#!/bin/bash
cd /home/ubuntu/iot-server/build


/usr/bin/pm2 kill
/usr/bin/pm2 start dist/main.js

