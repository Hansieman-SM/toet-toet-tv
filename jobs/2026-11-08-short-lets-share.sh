#!/bin/bash
# Short: Let's Share! – Ella's big watermelon is too big for one, so she shares a slice with every friend (from ep/en08_picnic.js, 86.2–119 s, full 16:9 frame)
set -e; S=2026-11-08-short-lets-share; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en08_picnic.js $O/audio.wav
OW=2560 OH=1440 node ep/en08_picnic.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 86.2 -t 32.8 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=31.8:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=31.3:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Let's Share!" --sub "One slice for everyone!" --colors "#ffe3e8,#3fae5a"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
