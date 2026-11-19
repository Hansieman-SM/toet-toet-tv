#!/bin/bash
# Short: Cozy Winter Village – Little Truck Toet drives slowly through the snowy village with his headlights on, a hedgehog sleds down the
# hill, a bear cub and a fox cub skate on the frozen pond, the snowman waves (from ep/village.js, T0=4, 45 s; no text in the source, full 16:9 frame)
set -e; S=2026-11-19-short-cozy-winter-village; O=release/$S; mkdir -p $O
python3 ep/village_music.py $O/music.wav 45
FADEIN=1 FADEOUT=1 DUR=45 T0=4 OW=2560 OH=1440 node ep/village.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -af "afade=out:st=41:d=4" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Cozy Winter Village" --sub "Wave hello to Little Truck Toet!" --colors "#f3eeff,#5b4fa8" --thumb-at 18
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
