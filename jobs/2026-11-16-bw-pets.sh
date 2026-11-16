#!/bin/bash
# Daily B&W sensory #15 (90 min): Pets – ep/bwd_pets.js (white pet friends with happy faces: sitting puppy wagging its tail with floppy ears,
# eye patch and a collar tag, kitten tapping a rolling ball of yarn with a swishing tail, hamster running in a turning wheel, goldfish swimming
# to and fro in a round bowl with rising bubbles, parrot bobbing on a swing perch, bunny hopping with twitching ears, turtle with a dotted
# shell walking slowly, striped ball bouncing with squash + stretch, happy dog bone with twinkling sparkles, little mouse peeking out of its
# hole next to a wedge of cheese; cosy room: window with twinkling stars and curtains, little hearts floating up, zig-zag rug;
# outro: puppy and kitten asleep together in a woven basket under a crescent moon, z z z)
# + ep/bwd_pets_music.py (guitar/musicbox/piano, no ambient, 4/4, A-flat). Last 20 min slowly dimmer.
set -e; S=2026-11-16-bw-pets; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_pets.js "python3 ep/bwd_pets_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=162 OW=1280 OH=720 node ep/bwd_pets.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Pet Friends" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
