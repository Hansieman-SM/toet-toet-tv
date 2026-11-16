#!/bin/bash
# 90-min calm video: Starry Space Trip (theme idea "space & planets with friendly astronaut animals") – a soft pastel night sky in space with
# twinkling stars, drifting pastel nebula clouds, four little smiling stars, a smiling Earth slowly turning with a little rocket orbiting it
# (a bear cub waves from the porthole, sparkle trail, no exhaust), a big peach ringed planet with a sleepy face that opens its eyes now and then,
# a kitten in a night cap asleep in a gently rocking crescent-moon hammock (z z z), a puppy gliding by in a little round flying saucer with
# twinkling lights, a smiling satellite, a comet with a sparkly tail, now and then a gentle shooting star; on the lilac moon surface a bunny
# astronaut in a bubble helmet does slow low-gravity hops and waves, a moon house with a round window where a hamster peeks out and waves,
# a flag with a heart, glowing moon flowers, rising star dust (ep/space.js)
# + new music: steel tongue drum melody, warm breathing analog-style synth pad, deep round sub bass, soft wind chimes; gentle 'space air'
# swells (floating 3/4, 64 bpm, A major; ep/space_music.py) + English thumbnail
set -e; S=2026-11-16-calm-starry-space-trip; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/space.js "python3 ep/space_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
THUMBBG=1 STILL=30 OW=1280 OH=720 node ep/space.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Starry Space Trip" "Calm Space Music · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
