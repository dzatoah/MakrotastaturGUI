#!/bin/bash

if [ -z $1 ]; then
platform="";
echo "Building for default platform"
else
platform="--platform="$1
echo "Building for platform: "$1
fi

npx electron-forge make --platform=$platform
