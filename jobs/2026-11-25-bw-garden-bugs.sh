#!/bin/bash
# Daily B&W sensory #22 (90 min): Garden Bugs – ep/bwd_bugs.js (white garden bugs with happy faces on black: little ant marching with a
# big crumb held high, wiggly worm popping out of a soil mound with a leaf hat, round beetle with a little horn and a striped shell that
# slowly opens (wings peek out), friendly spider swinging below a dew-drop web, grasshopper hopping on its long legs, roly-poly pill bug
# rolling up into a ball and unrolling, fluffy moth with eye-spot wings and feathery antennae, cricket on a spotted mushroom chirping
# with sound arcs + floating notes, stick insect swaying on a twig, ant hill with a little flag and ants peeking out of the doors in
# turn; grass blades + clover along the bottom, twinkling stars, drifting seed fluffs; outro: little worm and beetle asleep under a big
# mushroom with a leaf blanket and a crescent moon) + ep/bwd_bugs_music.py (guitar/kalimba/flute + garden birds, 4/4, A♭).
# Last 20 min slowly dimmer.
set -e; S=2026-11-25-bw-garden-bugs; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_bugs.js "python3 ep/bwd_bugs_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=108 STILL=42 OW=1280 OH=720 node ep/bwd_bugs.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Garden Bugs" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
