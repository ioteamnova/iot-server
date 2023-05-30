#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo /usr/bin/npm i
sudo /usr/bin/pm2 reload main