#!/bin/bash
# Short: Toet's Pumpkin Party – Happy Halloween (ep/halloween.js, 46 s, gentle, count 5 pumpkins)
set -e; S=2026-10-31-short-halloween; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/halloween.js $O/audio.wav
OW=2560 OH=1440 node ep/halloween.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Happy Halloween!" --sub "Count the pumpkins with Toet!" --colors "#ffb347,#5a2d82"
rm -f $O/src.mp4 $O/audio.wav $O/*.bg.png
