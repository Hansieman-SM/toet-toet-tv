#!/bin/bash
# Short: Small, Medium, Big! – Tessa the Tractor slowly lifts the BIG heavy pumpkin ("Umph!"), Toet: "Wow! You are strong, Tessa!",
# recap cards SMALL (light) / MEDIUM / BIG (heavy), Tessa drives off, "Thank you, Tessa!" (from ep/en15_tractor.js, 88.0–133.0 s,
# full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-24-short-small-medium-big; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en15_tractor.js $O/audio.wav
OW=2560 OH=1440 node ep/en15_tractor.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 88.0 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Small, Medium, Big!" --sub "Tessa the Tractor helps Toet" --colors "#fff1dc,#e8590c" --thumb-at 12
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
