#!/bin/bash
cd /home/ubuntu/iot-server/build


/user/bin/pm2 kill
/user/bin/pm2 start dist/main.js

