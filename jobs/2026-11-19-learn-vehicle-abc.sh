#!/bin/bash
# Learning series – ABC #4 (EN): Vehicle ABC with Little Truck Toet (ep/learn10_vehicle_abc.js: Toet parks on the main street of a little
# town – shops, flats, houses, a garage with a charging point, a traffic light slowly cycling red–yellow–green; per letter (5 s) alphabet strip,
# letter block, picture card with a gently moving original vehicle + word card with coloured first letter, Toet says "A is for Ambulance!":
# Ambulance, Bus, Crane, Digger, Electric car, Fire truck, Garbage truck, Helicopter, Ice cream truck, Jet, Kayak, Lawn mower, Motorbike,
# Night train, Ocean liner, Police car, Quad bike, Rocket, Submarine, Tractor, Unicycle, Van, Wagon, Xebec, Yacht, Zeppelin; recap A–Z;
# new music vehicleabc_long: melodica lead, ukulele strums, boom-chick upright bass, woodblock clip-clop + brushes, D major 4/4)
set -e; S=2026-11-19-learn-vehicle-abc; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn10_vehicle_abc.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn10_vehicle_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=39.2 OW=1280 OH=720 node ep/learn10_vehicle_abc.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Vehicle ABC" "Learn the Alphabet with Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
