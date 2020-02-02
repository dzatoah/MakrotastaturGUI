#!/bin/bash

command -v npm   >/dev/null 2>&1 || { echo >&2 "I require npm & npx but it's not installed.  Aborting."; exit 1; }
command -v npx   >/dev/null 2>&1 || { echo >&2 "I require npm & npx but it's not installed.  Aborting."; exit 1; }
command -v nuget >/dev/null 2>&1 || { echo >&2 "I require nuget but it's not installed.  Aborting."; exit 1; }

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
