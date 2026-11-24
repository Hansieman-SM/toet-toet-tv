#!/bin/bash
# Short: 10 Colorful Kites – count the kites with The Big Four: kites 1–6 rise from behind the hill on a windy autumn day (tray of 10,
# numeral + number word, rising chime) (from ep/learn17_kites.js, 13.0–58.0 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-24-short-colorful-kites; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn17_kites.js $O/audio.wav
OW=2560 OH=1440 node ep/learn17_kites.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 13.0 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Colorful Kites" --sub "Count the kites with The Big Four!" --colors "#e3f4ff,#2f9bea" --thumb-at 24
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
