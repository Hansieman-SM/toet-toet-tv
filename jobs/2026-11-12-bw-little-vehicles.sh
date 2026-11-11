#!/bin/bash
# Daily B&W sensory #10 (90 min): Little Vehicles – ep/bwd_vehicles.js (Little Truck Toet (electric, lightning bolt on his box), long bus with
# round windows, little train with one carriage + turning coupling rod, sailing boat bobbing on waves, plane with spinning propeller,
# bicycle with spoked wheels + basket face, tractor with one big wheel, helicopter with turning rotor, round scooter, striped hot-air balloon;
# rolling hills, road with moving dashed line, drifting clouds, twinkling stars, rising sparkles;
# outro: Little Truck Toet asleep in his garage, plugged in, under a crescent moon)
# + ep/bwd_vehicles_music.py (piano/music box/cello, no ambient, 4/4, D). Last 20 min slowly dimmer.
set -e; S=2026-11-12-bw-little-vehicles; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_vehicles.js "python3 ep/bwd_vehicles_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=114 OW=1280 OH=720 node ep/bwd_vehicles.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Little Vehicles" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
