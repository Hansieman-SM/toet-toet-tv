#!/bin/bash
# Short: Can You Find It? – Shapes with The Big Four: Leo asks for a CIRCLE, Ella for a SQUARE, Nico for a TRIANGLE; cards pop up out of
# the bushes, 3-dot pause, then the clock, the window and the party hat light up
# (from ep/learn09_find_shapes.js, 12.8–52.2 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-16-short-can-you-find-it-shapes; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn09_find_shapes.js $O/audio.wav
OW=2560 OH=1440 node ep/learn09_find_shapes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 12.8 -t 39.4 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=38.4:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=37.9:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Can You Find It?" --sub "Shapes with The Big Four" --colors "#effaf6,#2a9d8f" --thumb-at 3.5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
