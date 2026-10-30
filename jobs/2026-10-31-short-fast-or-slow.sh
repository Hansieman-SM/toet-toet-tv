#!/bin/bash
# Short: Fast or Slow? – bunny & snail, then the balloon goes up and down (from ep/en03_opposites.js, 53–110 s, full 16:9 frame)
# rev2 2026-10-30: speech bubbles moved off the bunny/snail/balloon
set -e; S=2026-10-31-short-fast-or-slow; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en03_opposites.js $O/audio.wav
OW=2560 OH=1440 node ep/en03_opposites.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 53.0 -t 57 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=56:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=55.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Fast or Slow?" --sub "Up or down? Learn opposites!" --colors "#d6f5c9,#4cc9f0"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
