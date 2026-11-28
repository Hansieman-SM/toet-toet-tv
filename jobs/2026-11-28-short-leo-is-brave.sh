#!/bin/bash
# Short: Leo Is Brave! – Leo is scared of the river, Ella stands in the water beside the stones, Leo hops across while everybody counts
# 1–5, "I did it!" – brave (from ep/en18_stones.js, 73.0–109.0 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-28-short-leo-is-brave; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en18_stones.js $O/audio.wav
OW=2560 OH=1440 node ep/en18_stones.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 73.0 -t 36 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=35:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=34.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Leo Is Brave!" --sub "Count the stepping stones!" --colors "#e7f5ff,#1c7ed6" --thumb-at 26.5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
