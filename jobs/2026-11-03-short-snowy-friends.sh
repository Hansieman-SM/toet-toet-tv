#!/bin/bash
# Short: Snowy Friends – who lives in the snow? (from ep/arctic.js, T0=30, 45 s: beluga hello, sliding baby penguin, penguin family, hare; full 16:9 frame)
set -e; S=2026-11-03-short-snowy-friends; O=release/$S; mkdir -p $O
python3 ep/arctic_music.py $O/music.wav 45
FADE=1 DUR=45 T0=30 OW=2560 OH=1440 node ep/arctic.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Snowy Friends" --sub "Who lives in the snow?" --colors "#e6e0f8,#9f9ad6"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
