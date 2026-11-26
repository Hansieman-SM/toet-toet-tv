#!/bin/bash
# Short: 10 Sleepy Hedgehogs – count the hedgehogs with Little Truck Toet: hedgehogs 1–6 waddle out of the hedge and snuggle into the
# leaf pile for their winter sleep (tray of 10, numeral + number word, rising chime) (from ep/learn19_hedgehogs.js, 11.5–56.5 s,
# full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-26-short-sleepy-hedgehogs; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn19_hedgehogs.js $O/audio.wav
OW=2560 OH=1440 node ep/learn19_hedgehogs.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 11.5 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Sleepy Hedgehogs" --sub "Count the hedgehogs with Toet!" --colors "#fff1e0,#d9772e" --thumb-at 35
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
