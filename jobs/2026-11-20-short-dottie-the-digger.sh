#!/bin/bash
# Short: Dottie the Digger – FIRST we dig (three scoops, count 1-2-3), THEN we plant the little tree (from ep/en13_digger.js, 45.6–89.6 s,
# full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-20-short-dottie-the-digger; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en13_digger.js $O/audio.wav
OW=2560 OH=1440 node ep/en13_digger.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 45.6 -t 44 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=43:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=42.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Dottie the Digger" --sub "Dig, dig, dig – 1, 2, 3!" --colors "#fff4d6,#f59f00" --thumb-at 6.4
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
