#!/bin/bash
# Daily B&W sensory #21 (90 min): Night Lights – ep/bwd_nightlights.js (white night lights with happy faces on black: camping lantern with a
# swinging handle and pulsing rays, candle in a holder with a flickering flame and a slow drip, striped lighthouse on a rock with a turning
# beam and waves, glass jar with a ribbon on the lid and fireflies circling inside, hanging star mobile with little stars and a crescent,
# mushroom night-light with glowing dots and a plug, window with swaying curtains + a peeking moon and stars, sleepy cat curled on a
# cushion (tail swish, opens one eye now and then), old-fashioned street lamp with a light cone and drifting specks, fairy-light garland
# with bulbs glowing in turn; little rooftops with windows switching on and off, twinkling stars; outro: sleepy crescent moon in a night
# cap holding a tiny lantern) + ep/bwd_nightlights_music.py (celesta/cello/music box + night crickets, 3/4, A). Last 20 min slowly dimmer.
set -e; S=2026-11-24-bw-night-lights; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_nightlights.js "python3 ep/bwd_nightlights_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=80 STILL=42 OW=1280 OH=720 node ep/bwd_nightlights.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Night Lights" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
