#!/bin/bash
# Episode (EN): The Big Four – Bubble Fun! (ep/en12_bubbles.js: Ella finds a bucket of bubble soap and blows bubbles with her trunk; the friends
# hop up and pop five bubbles – count 1-2-3-4-5; Boris pops ALL the bubbles at once and Nico doesn't get one (sad) → Ella: "Let's take turns!";
# Nico's turn, Leo's turn, Boris's turn (he waited); a GIANT bubble floats over everyone and pops into lots of little bubbles; sunset recap 1–5
# + "Taking turns is fun!"; new music bubbles_long: bouncy toy-box polka – bubbly 'glass' lead, toy piano off-beats, pizzicato bass,
# water-drop 'bloop' percussion + shaker, D major)
set -e; S=2026-11-15-episode-bubble-fun; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en12_bubbles.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en12_bubbles.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=110.6 OW=1280 OH=720 node ep/en12_bubbles.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Bubble Fun!" "Count and take turns with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
