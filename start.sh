#!/bin/sh


cd /app/builder


echo "Starting builder service on port 3002..."
NODE_ENV=production node src/app.js &


cd /


echo "Starting Nginx..."
nginx -g 'daemon off;'
