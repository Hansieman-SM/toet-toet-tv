#!/bin/bash
# Short: Little Vehicles – black & white helicopter, Little Truck Toet, hot-air balloon, tractor (from ep/bwd_vehicles.js, loop T0=96, 45 s; full 16:9 frame)
set -e; S=2026-11-12-short-little-vehicles; O=release/$S; mkdir -p $O
python3 ep/bwd_vehicles_music.py $O/music.wav 45
FADEIN=1 FADEOUT=1 DUR=45 T0=96 OW=2560 OH=1440 node ep/bwd_vehicles.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -af "afade=out:st=41:d=4" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Little Vehicles" --sub "Black & white for babies" --colors "#f2f2f2,#3a3a3a"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
