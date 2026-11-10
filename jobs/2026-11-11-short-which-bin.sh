#!/bin/bash
# Short: Which Bin? – Rosie the Recycling Truck: three green bottles into the GREEN bin (count 1-2-3), then plastic into the YELLOW bin
# (from ep/en09_recycle.js, 56.6–101.6 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-11-short-which-bin; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en09_recycle.js $O/audio.wav
OW=2560 OH=1440 node ep/en09_recycle.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 56.6 -t 45.0 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44.0:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Which Bin?" --sub "Sort with Rosie the Recycling Truck" --colors "#e6fff4,#2d8a6e"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
