#!/usr/bin/env bash

if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    cp binding.linux.gyp binding.gyp
    ./node_modules/.bin/node-gyp rebuild
fi
