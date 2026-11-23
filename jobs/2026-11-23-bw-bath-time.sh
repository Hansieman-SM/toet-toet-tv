#!/bin/bash
# Daily B&W sensory #20 (90 min): Bath Time – ep/bwd_bath.js (white bath things with happy faces on black: rubber duck bobbing on little
# waves with "squeak" rings, soap-bubble cluster with circling little bubbles (one pops and grows back), bar of soap with a heart and a
# foam crown, toy sailing boat with a striped sail rocking on the waves, striped towel swinging on a hook, wind-up toy whale on wheels with
# a turning key and a little fountain, sponge full of holes that squishes out drops, claw-foot bathtub with a dripping tap and rising
# bubbles, squeezy octopus bath toy in a pompom cap squirting a tiny water arc, puffy star bath sponge turning with sparkles; row of bath
# tiles, stars, rising bubbles; outro: rubber duck asleep on a stack of folded towels under a crescent moon) + ep/bwd_bath_music.py
# (kalimba/vibes/harp, no ambient, 4/4, G). Last 20 min slowly dimmer.
set -e; S=2026-11-23-bw-bath-time; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_bath.js "python3 ep/bwd_bath_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=70 STILL=186 OW=1280 OH=720 node ep/bwd_bath.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Bath Time" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
