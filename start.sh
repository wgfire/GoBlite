#!/bin/sh

# Set the working directory for the builder service
cd /app/builder

# Start the builder service in the background
# NODE_ENV=production is specified in its package.json start script via cross-env
# We ensure NODE_ENV is set for the node process directly.
echo "Starting builder service on port 3002..."
NODE_ENV=production node src/app.js &

# Go back to a neutral directory or where nginx expects to be run from if necessary (usually not an issue)
cd /

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'
