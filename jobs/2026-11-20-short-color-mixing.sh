#!/bin/bash
# Short: Toet's Color Mixing – red + yellow, blue + yellow, red + blue: pour, swirl, 3-dot pause, then orange, green and purple
# (from ep/learn11_colormix.js, 13.0–58.0 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-20-short-color-mixing; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn11_colormix.js $O/audio.wav
OW=2560 OH=1440 node ep/learn11_colormix.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 13.0 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Toet's Color Mixing" --sub "What will it be?" --colors "#f6efff,#9b5de5" --thumb-at 10.2
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
