#!/bin/bash
# Daily B&W sensory #23 (90 min): Space Trip – ep/bwd_space.js (white space friends with happy faces on black: little astronaut
# floating on a wavy tether and waving, round alien friend with springy star-tipped antennae, satellite whose striped solar panels
# slowly turn over (blinking dish + signal arcs), smiling Earth with continents and clouds drifting around, flying saucer with a
# little pilot under the dome, running rim lights and a soft beam, space station with a turning wheel of windows, electric moon rover
# (lightning-bolt sign, solar panel, no exhaust) rolling over little craters with turning wheels, telescope on a tripod finding
# twinkling sparkles, space puppy in a bubble helmet paddling and wagging, sleepy spiral galaxy slowly turning its arms of dots;
# twinkling stars at the sides, a cratered planet curve along the bottom, tiny drifting space dots; outro: the little astronaut asleep
# in a hammock between two sleepy stars) + ep/bwd_space_music.py (vibes/celesta/cello, no ambient, 3/4, E).
# Last 20 min slowly dimmer.
set -e; S=2026-11-26-bw-space-trip; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_space.js "python3 ep/bwd_space_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=96 STILL=30 OW=1280 OH=720 node ep/bwd_space.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Space Trip" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
