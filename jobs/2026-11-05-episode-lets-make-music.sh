#!/bin/bash
# Episode (EN): The Big Four – Let's Make Music! (ep/en06_music.js: Leo drum + count 1-2-3, Nico maracas fast/slow, Boris xylophone low→high,
# Ella feels sad without an instrument → her trunk is a trumpet, band plays together on the beat, recap; new reggae music music_long: melodica, organ skank, one-drop)
set -e; S=2026-11-05-episode-lets-make-music; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en06_music.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en06_music.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=123.5 OW=1280 OH=720 node ep/en06_music.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Let's Make Music!" "Drum, maracas & more with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
