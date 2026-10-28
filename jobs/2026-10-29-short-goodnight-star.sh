#!/bin/bash
# Short: Goodnight, Star! – a star in the present + shape recap (from ep/en01_shapes.js, 115.4–152.4 s)
# rev2 2026-10-28: 1440p + bubble margin
set -e; S=2026-10-29-short-goodnight-star; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en01_shapes.js $O/audio.wav
OW=2560 OH=1440 node ep/en01_shapes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 115.4 -t 37 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=36:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=35.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Goodnight, Star!" --sub "What is in the present?" --colors "#2c3c78,#9b8ad8"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
