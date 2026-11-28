#!/bin/bash
# Short: 10 Christmas Baubles – Little Truck Toet hangs the first six smiling baubles on the Christmas tree, counting 1–6 with numeral +
# number word (from ep/learn21_baubles.js, 14.0–56.0 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-28-short-christmas-baubles; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn21_baubles.js $O/audio.wav
OW=2560 OH=1440 node ep/learn21_baubles.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 14.0 -t 42 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=41:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=40.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "10 Christmas Baubles" --sub "Count with Little Truck Toet!" --colors "#fff5f5,#c92a2a" --thumb-at 17.5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
