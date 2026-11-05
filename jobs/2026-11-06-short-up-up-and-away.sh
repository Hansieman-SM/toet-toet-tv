#!/bin/bash
# Short: Up, Up and Away! – bunny and bear cub wave from their hot-air balloons over the pastel hills (from ep/balloons.js, T0=40, 45 s; no text in the source, full 16:9 frame)
set -e; S=2026-11-06-short-up-up-and-away; O=release/$S; mkdir -p $O
python3 ep/balloons_music.py $O/music.wav 45
FADE=1 DUR=45 T0=40 OW=2560 OH=1440 node ep/balloons.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Up, Up and Away!" --sub "Wave hello to the balloons!" --colors "#cfe6f5,#ffc9d9"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
