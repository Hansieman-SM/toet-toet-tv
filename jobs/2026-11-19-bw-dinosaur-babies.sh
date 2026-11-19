#!/bin/bash
# Daily B&W sensory #16 (90 min): Dinosaur Babies – ep/bwd_dino.js (white dinosaur friends with happy faces: long-neck dino slowly nodding
# its head with a spotted back, horned dino with three soft rounded horns and a scalloped frill wagging its tail, cracked egg whose top shell
# lifts so a baby dino peeks out and blinks, little hatchling hopping along with tiny back spikes, calm smiling mountain-volcano puffing a
# little round smiling cloud (no fire), big fern with swaying fronds and an unrolling curl next to a smiling stone, a trail of three-toed
# footprints appearing one by one up to a waving baby dino, flying dino gliding with flapping wings, plated dino walking slowly with stepping
# legs and tail spikes, prehistoric palm tree with a little dino peeking out from behind the trunk, left and right in turn;
# background: twinkling stars, rolling hills with grass tufts, star dust drifting up;
# outro: baby dino asleep curled up in its eggshell in a twig nest under a crescent moon, z z z)
# + ep/bwd_dino_music.py (cello/kalimba/flute + soft wind, 3/4, E-flat). Last 20 min slowly dimmer.
set -e; S=2026-11-19-bw-dinosaur-babies; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_dino.js "python3 ep/bwd_dino_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=54 OW=1280 OH=720 node ep/bwd_dino.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Dinosaur Babies" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
