#!/bin/bash
# Short: Winter ABC with Little Truck Toet – A is for Arctic fox, B Boots, C Cocoa, D Deer, E Earmuffs, F Fireplace, G Gloves, H Hedgehog,
# I Igloo (from ep/learn14_winter_abc.js, 10.8–55.8 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-23-short-winter-abc; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn14_winter_abc.js $O/audio.wav
OW=2560 OH=1440 node ep/learn14_winter_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 10.8 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Winter ABC" --sub "A is for Arctic fox!" --colors "#eaf6ff,#0096c7" --thumb-at 3.6
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
