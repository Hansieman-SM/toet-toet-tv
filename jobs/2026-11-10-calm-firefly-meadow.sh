#!/bin/bash
# 90-min calm video: Firefly Meadow – a pastel dusk meadow with a sleepy crescent moon, twinkling first stars and a swaying weeping willow;
# a lily pond with a frog mama (throat puffs) + froglet (little hop), cattails, a bunny family peeking out of the tall grass in turn,
# a little raccoon peeking from behind a tree stump and waving, a dozing ladybird on a bellflower opening her wings, a dragonfly looping
# over the pond, a tortoise strolling through the front grass, dandelion clocks and lots of glowing fireflies (ep/firefly.js)
# + new music: vibraphone melody with motor tremolo, bowed string pad, rolling harp arpeggios, humming bass; evening crickets,
# breeze and a soft far-away frog croak (slow 4/4, 58 bpm, D-flat major; ep/firefly_music.py) + English thumbnail
set -e; S=2026-11-10-calm-firefly-meadow; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/firefly.js "python3 ep/firefly_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
STILL=183 OW=1280 OH=720 node ep/firefly.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Firefly Meadow" "Calm Music for Babies & Toddlers"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
