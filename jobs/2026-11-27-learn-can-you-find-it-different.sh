#!/bin/bash
# Learning series #20 – Can You Find It? #4: Which One Is Different? with The Big Four (ep/learn20_different.js: golden late-afternoon
# savanna, four woven baskets on a long log; per round four cards pop up – three the same, one different – "Which one is different?",
# a friend asks, quiet 3-dot pause, then the different card glows with its name: apples + pear, ducks + frog, stars + heart,
# red balls + blue ball, fish + crab, cars + boat; recap "The different ones!", the friends walk off; new music different_long:
# bansuri-style bamboo flute, harp broken chords, soft bass, shaker, lilting 6/8 in A)
set -e; S=2026-11-27-learn-can-you-find-it-different; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn20_different.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn20_different.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=20 OW=1280 OH=720 node ep/learn20_different.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Which One Is Different?" "Can You Find It? with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
