#!/bin/bash
# Short: 10 Little Ducklings – ducklings pop out of the reeds and swim to Mama Duck, count 1 to 6 with Little Truck Toet
# (from ep/learn12_ducklings.js, 13.6–58.6 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-21-short-10-little-ducklings; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn12_ducklings.js $O/audio.wav
OW=2560 OH=1440 node ep/learn12_ducklings.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 13.6 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "10 Little Ducklings" --sub "Count with Little Truck Toet!" --colors "#fff8d6,#4fa3d1" --thumb-at 20.0
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
