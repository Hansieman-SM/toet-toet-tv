#!/bin/bash
# Short: Scrub, Scrub, Scrub! – Toet at the car wash, it tickles, sparkling clean (from ep/av05_wasstraat_en.js, 54–87.6 s, full 16:9 frame)
# rev2 2026-10-30: ends after the car wash (Bus Bas would be cut off at the frame edge later)
set -e; S=2026-10-31-short-scrub-scrub-scrub; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/av05_wasstraat_en.js $O/audio.wav
OW=2560 OH=1440 node ep/av05_wasstraat_en.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 54.0 -t 33.6 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=32.6:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=32.1:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Scrub, Scrub, Scrub!" --sub "Toet at the car wash" --colors "#cdeeff,#9b5de5"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
