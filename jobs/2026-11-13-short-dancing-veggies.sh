#!/bin/bash
# Short: Dancing Veggies – the watermelon slice, pea pod, strawberry, carrot and pumpkin each do a little solo dance in the sunny garden
# (from ep/veggies.js, loop T0=6, 45 s; no text in the source, full 16:9 frame)
set -e; S=2026-11-13-short-dancing-veggies; O=release/$S; mkdir -p $O
python3 ep/veggies_music.py $O/music.wav 45
FADEIN=1 FADEOUT=1 DUR=45 T0=6 OW=2560 OH=1440 node ep/veggies.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Dancing Veggies" --sub "Who dances next?" --colors "#fff3d6,#7fc27a" --thumb-at 3.5
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
