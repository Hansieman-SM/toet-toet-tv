#!/bin/bash
# Short: Autumn Forest – who lives in the forest? (from ep/autumn.js, T0=20, 45 s, full 16:9 frame)
set -e; S=2026-10-30-short-autumn-forest-friends; O=release/$S; mkdir -p $O
python3 ep/autumn_music.py $O/music.wav 45
FADE=1 DUR=45 T0=20 OW=2560 OH=1440 node ep/autumn.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Autumn Forest" --sub "Who lives in the forest?" --colors "#fde3c4,#c9a3c4"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
