#!/bin/bash
echo "uploading sketch/build-uno/sketch.hex"
make -s -C sketch/ | egrep "Device|Program|Data|error"
avrdude -p m328p -c gpio -e -U flash:w:sketch/build-uno/sketch.hex
echo "cleaning"
rm -rf sketch/build-uno
echo "done"
