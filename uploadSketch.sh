#!/bin/bash
echo "uploading sketch/build-uno/sketch.hex"
rm -rf sketch/build-uno
make -C sketch/ | egrep "Device|Program|Data|error"
avrdude -p m328p -c gpio -e -U flash:w:sketch/build-uno/sketch.hex
