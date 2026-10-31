#!/bin/bash
# Short: Where Is Mama Duck? – Toet asks the sheep, then finds Mama Duck at the pond (from ep/av09_eend_en.js, 72.5–118 s, full 16:9 frame)
set -e; S=2026-11-01-short-where-is-mama-duck; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/av09_eend_en.js $O/audio.wav
OW=2560 OH=1440 node ep/av09_eend_en.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 72.5 -t 45.5 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44.5:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=44:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Where Is Mama Duck?" --sub "Help Little Truck Toet look!" --colors "#fff3c4,#ffb627"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
