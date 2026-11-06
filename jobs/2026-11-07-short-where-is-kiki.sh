#!/bin/bash
# Short: Where Is Kiki? – Little Truck Toet finds Kiki the kitten IN the box and ON the wall (from ep/en07_hide.js, 30.5–78.5 s, full 16:9 frame)
set -e; S=2026-11-07-short-where-is-kiki; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en07_hide.js $O/audio.wav
OW=2560 OH=1440 node ep/en07_hide.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 30.5 -t 48 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=47:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=46.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Where Is Kiki?" --sub "In the box? On the wall?" --colors "#fff4e0,#ff9f1c"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
