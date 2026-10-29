#!/bin/bash
# Short: Who Can Help Toet? – flat tire, Tow Truck Tim helps (from ep/av07_band_en.js "Toet Has a Flat Tire", 9–62 s, full 16:9 frame)
set -e; S=2026-10-30-short-who-can-help-toet; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/av07_band_en.js $O/audio.wav
OW=2560 OH=1440 node ep/av07_band_en.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 9.0 -t 53 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=52:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=51.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Who Can Help Toet?" --sub "Oh no, a flat tire!" --colors "#cdeeff,#ff9f5a"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
