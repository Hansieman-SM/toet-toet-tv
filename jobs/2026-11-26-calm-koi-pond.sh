#!/bin/bash
# Calm 90 min (EN): Koi Pond – a pastel garden pond on a soft spring-like morning: mint-peach sky with drifting clouds, soft far hills;
# a blossom tree with a little blue bird whose pink petals drift down and land on the water with ripple rings; a small waterfall trickling
# over rocks; a gently arched wooden footbridge where Little Truck Toet (electric, no exhaust) rolls slowly over now and then on the sandy
# shore path; five smiling koi (orange, white-red, gold, calico, cream) swim slow loops with waving tails and rising bubbles; lily pads with
# lotus flowers that open and close and a frog that puffs its throat and hops from pad to pad; a turtle sunbathing on a rock who nods;
# a snail on a stone; a dragonfly hovering and darting; swaying reeds, shimmer on the water (ep/koi.js)
# + new music: ocarina melody, hammered-dulcimer arpeggios, bowed viola pad, round sine bass; small waterfall trickle, water-drop plinks,
# a far-away frog (slow 3/4, 60 bpm, F major; ep/koi_music.py) + English thumbnail
set -e; S=2026-11-26-calm-koi-pond; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/koi.js "python3 ep/koi_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
THUMBBG=1 STILL=26 OW=1280 OH=720 node ep/koi.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Koi Pond" "Calm Garden Music · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
