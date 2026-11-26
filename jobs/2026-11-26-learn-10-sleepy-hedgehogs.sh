#!/bin/bash
# Learning series #19 – Counting #7 (EN): 10 Sleepy Hedgehogs with Little Truck Toet (ep/learn19_hedgehogs.js: a warm golden late-autumn
# afternoon at the forest edge; Toet parks by a big cosy leaf pile under an old tree next to a hedge; one by one ten little hedgehogs
# (each its own accent: coloured leaf / little apple on the spikes, scarf, bow, different sizes) waddle out of the hedge, climb the pile,
# yawn and snuggle into the leaves – tray of 10, big numeral + number word, rising chime; TEN!, recap 1–10, soft dusk, the leaf pile
# breathes with tiny snores (Zzz), "Hedgehogs sleep all winter long!", "Good night, hedgehogs!"; new music hedgehogs_long: slow cosy
# cradle waltz in B-flat – bowed cello lead, music-box tines, soft round bass, hushed leaf brush)
set -e; S=2026-11-26-learn-10-sleepy-hedgehogs; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn19_hedgehogs.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn19_hedgehogs.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=60.5 OW=1280 OH=720 node ep/learn19_hedgehogs.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "10 Sleepy Hedgehogs" "Count to 10 with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
