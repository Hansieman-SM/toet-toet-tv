#!/bin/bash
# Short: Up, Up, Up! – Toet asks Freddie the Fire Truck for help, the ladder goes up (count 1-2-3-4-5), Kiki hops on and rides down
# (from ep/en11_firetruck.js, 39.4–87.0 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-14-short-up-up-up; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en11_firetruck.js $O/audio.wav
OW=2560 OH=1440 node ep/en11_firetruck.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 39.4 -t 47.6 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=46.6:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=46.1:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Up, Up, Up!" --sub "Count with Freddie the Fire Truck" --colors "#fff1ec,#e63946" --thumb-at 23.6
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
