#!/bin/bash
echo "---start---"
rm -rf sketch/build-uno
make -C sketch/ | egrep "Device|Program|Data|error"
echo "---next---"
avrdude -p m328p -c gpio -e -U flash:w:sketch/build-uno/sketch.hex
