#!/bin/bash
# Short: Vehicle ABC with Little Truck Toet – A is for Ambulance, B Bus, C Crane, D Digger, E Electric car, F Fire truck, G Garbage truck,
# H Helicopter, I Ice cream truck (from ep/learn10_vehicle_abc.js, 10.8–55.8 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-19-short-vehicle-abc; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn10_vehicle_abc.js $O/audio.wav
OW=2560 OH=1440 node ep/learn10_vehicle_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 10.8 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Vehicle ABC" --sub "A is for Ambulance!" --colors "#eafaf5,#2a9d8f" --thumb-at 3.6
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
