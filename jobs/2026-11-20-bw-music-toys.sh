#!/bin/bash
# Daily B&W sensory #17 (90 min): Music Toys – ep/bwd_music.js (white music toys with happy faces on black: drum with two sticks tapping in
# turn and ripple rings on the skin, xylophone with a hopping mallet and a smiling knob, swinging bell with clapper and sound arcs, trumpet
# puffing little notes, piano keys pressing one after another, guitar with shimmering strings, two maracas shaking in turn, a beamed pair of
# bouncing music notes with a floating heart, baby rattle with rolling beads, little harp with shimmering strings; drifting music staff,
# twinkling stars, notes floating up; outro: the little drum asleep with crossed sticks under a crescent moon)
# + ep/bwd_music_music.py (music box/vibes/guitar, no ambient, 3/4, B-flat). Last 20 min slowly dimmer.
set -e; S=2026-11-20-bw-music-toys; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_music.js "python3 ep/bwd_music_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=54 OW=1280 OH=720 node ep/bwd_music.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Music Toys" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
