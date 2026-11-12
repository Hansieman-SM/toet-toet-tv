#!/bin/bash
# Short: Can You Find It? – Little Truck Toet asks for something RED, BLUE and YELLOW; 3-dot pause, then apple, umbrella and duck light up
# (from ep/learn05_find_colours.js, 12.8–52.2 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-13-short-can-you-find-it; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn05_find_colours.js $O/audio.wav
OW=2560 OH=1440 node ep/learn05_find_colours.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 12.8 -t 39.4 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=38.4:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=37.9:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Can You Find It?" --sub "Red, blue or yellow?" --colors "#eaf4ff,#3a86ff" --thumb-at 9.5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
