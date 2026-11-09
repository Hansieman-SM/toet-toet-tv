#!/bin/bash
# Short: A Is for Apple! – the first letters of Toet's ABC Drive: A Apple, B Ball, C Cow, D Duck, E Egg, F Fish, G Grapes, H Hat, I Ice cream
# (from ep/learn02_abc.js, 11.0–56.0 s, full 16:9 frame – contains text, so no crop)
set -e; S=2026-11-10-short-a-is-for-apple; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn02_abc.js $O/audio.wav
OW=2560 OH=1440 node ep/learn02_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 11.0 -t 45.0 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44.0:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "A Is for Apple!" --sub "Learn the ABC with Little Truck Toet" --colors "#fff4e6,#ff7a45"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
