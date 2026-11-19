#!/bin/bash
# 90-min calm video: Cozy Winter Village – a pastel snowy evening village (cosy winter, not Christmas): lilac-pink sky with a big gentle
# moon that opens its eyes now and then, first stars, drifting clouds, snowy hills with tiny far-away houses; a row of five little pastel
# houses with snowy roofs and warm glowing windows (a cat blinks and swishes its tail in one window, a bunny family waves from another),
# soft steam puffs from the chimneys, a warm street lamp, an owl in a little scarf on a snowy bare tree; a hedgehog in a wool hat sleds
# down the hill and pulls its sled back up; a snowman with a scarf and top hat waves; on the frozen pond a bear cub and a fox cub skate
# slow little loops; Little Truck Toet (electric, no exhaust) drives slowly through the village with his headlights on, snow on his roof;
# snowy pines, twinkling snow sparkles, softly falling snow (ep/village.js)
# + new music: celesta melody, felt-piano chords, pizzicato strings, round plucked bass, a very soft sleigh-bell shimmer; soft winter wind
# + quiet fireplace crackle (rocking 6/8, ~50 bpm, E-flat major; ep/village_music.py) + English thumbnail
set -e; S=2026-11-19-calm-cozy-winter-village; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/village.js "python3 ep/village_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
THUMBBG=1 STILL=26 OW=1280 OH=720 node ep/village.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Cozy Winter Village" "Calm Winter Music · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
