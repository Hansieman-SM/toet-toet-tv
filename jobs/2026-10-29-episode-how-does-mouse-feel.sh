#!/bin/bash
# Episode (EN): The Big Four – How Does Mouse Feel? (ep/en02_kind.js, feelings sad/happy, being kind, sharing, counting)
set -e; S=2026-10-29-episode-how-does-mouse-feel; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en02_kind.js $O/audio.wav
node ep/en02_kind.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=75 OW=1280 OH=720 node ep/en02_kind.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "How Does Mouse Feel?" "Sad or happy? Being kind with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
