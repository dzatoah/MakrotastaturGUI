#!/bin/bash

if [ -z $1 ]; then
platform="";
echo "Building for default platform"
else
platform="--platform="$1
echo "Building for platform: "$1
fi

echo "npm install..."
sleep 0.5s
npm install

echo "electron-forge make..."
sleep 0.5s
npx electron-forge make --platform=$platform
