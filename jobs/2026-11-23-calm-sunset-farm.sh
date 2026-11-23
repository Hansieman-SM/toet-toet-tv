#!/bin/bash
# Calm 90 min (EN): Sunset Farm – a pastel farm at golden sunset (late-autumn harvest feeling): peach-pink sky with a sleepy smiling sun
# that opens its eyes now and then, drifting pink clouds, birds gliding home in a little V, first stars; a red barn with a cat peeking from
# the hay-loft window and a swinging rooster weathervane, a farm windpump with a slowly turning wheel, haystacks and pumpkins; a horse nodding
# over the white fence, a cow mama grazing (head down/up, tail swish) with her calf, three fluffy sheep on the hill (one hops now and then),
# a pig family in a mud puddle with wiggly tails, a hen with three pecking chicks, a duck mama with three ducklings swimming slow loops on the
# pond, fireflies at dusk; Little Truck Toet (electric, no exhaust) drives slowly along the farm lane with a crate of apples (ep/farm.js)
# + new music: harmonica melody, autoharp strums, bowed double bass, soft brushes; evening crickets, a far-away cowbell, soft breeze
# (slow 4/4, 58 bpm, G major; ep/farm_music.py) + English thumbnail
set -e; S=2026-11-23-calm-sunset-farm; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/farm.js "python3 ep/farm_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
THUMBBG=1 STILL=26 OW=1280 OH=720 node ep/farm.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Sunset Farm" "Calm Farm Music · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
