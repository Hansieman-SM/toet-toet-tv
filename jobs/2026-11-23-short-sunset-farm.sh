#!/bin/bash
# Short: Sunset Farm – Little Truck Toet drives along the farm lane with a crate of apples, the cow mama grazes with her calf, the horse
# nods over the fence, piglets in the mud, hen + chicks peck, ducklings swim after Mama Duck (from ep/farm.js, T0=6, 45 s; no text in the
# source, full 16:9 frame)
set -e; S=2026-11-23-short-sunset-farm; O=release/$S; mkdir -p $O
python3 ep/farm_music.py $O/music.wav 45
FADEIN=1 FADEOUT=1 DUR=45 T0=6 OW=2560 OH=1440 node ep/farm.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -af "afade=out:st=41:d=4" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Sunset Farm" --sub "Hello, farm friends!" --colors "#fff1e0,#d9645e" --thumb-at 22
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
