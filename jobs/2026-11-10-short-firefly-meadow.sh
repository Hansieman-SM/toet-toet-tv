#!/bin/bash
# Short: Firefly Meadow – glowing fireflies over a pastel dusk pond, the little raccoon peeks out from behind the stump and waves,
# frog mama puffs her throat, a tortoise strolls by, bunnies peek out of the grass (from ep/firefly.js, T0=180, 45 s; no text in the source, full 16:9 frame)
set -e; S=2026-11-10-short-firefly-meadow; O=release/$S; mkdir -p $O
python3 ep/firefly_music.py $O/music.wav 45
FADE=1 DUR=45 T0=180 OW=2560 OH=1440 node ep/firefly.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Firefly Meadow" --sub "Can you spot the fireflies?" --colors "#e4dcf7,#ffe9a8"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
