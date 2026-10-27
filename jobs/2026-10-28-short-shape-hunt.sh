#!/bin/bash
# Short: Shape Hunt – circle and triangle (from ep/en01_shapes.js, 20.5–77.5 s)
set -e; S=2026-10-28-short-shape-hunt; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en01_shapes.js $O/audio.wav
node ep/en01_shapes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i $O/audio.wav -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 20.5 -t 57 -i $O/full.mp4 -vf "fade=in:st=0:d=0.6,fade=out:st=56:d=1" -af "afade=in:st=0:d=0.6,afade=out:st=55.5:d=1.5" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Shape Hunt!" --sub "Circle or triangle?" --cx 900 --colors "#ffe8a3,#ff7a45"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
