#!/bin/bash
# Daily B&W sensory #18 (90 min): Flowers Bloom – ep/bwd_flowers.js (white flowers + garden things with happy faces on black: tulip opening
# and closing, rose with a turning spiral, water lily unfolding on its pad, watering can pouring drops, pot with a sprout that grows and
# blooms, seed sprouting two leaves, dandelion puff whose seeds drift away, arch of swinging bell flowers, waving cactus with a flower,
# turning striped pinwheel flower; grass tufts with tiny flowers, stars, drifting petals; outro: the tulip asleep in its pot under a
# crescent moon) + ep/bwd_flowers_music.py (harp/piano/flute + soft garden birds, 4/4, F-sharp). Last 20 min slowly dimmer.
set -e; S=2026-11-21-bw-flowers-bloom; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_flowers.js "python3 ep/bwd_flowers_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=50 STILL=186 OW=1280 OH=720 node ep/bwd_flowers.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Flowers Bloom" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
