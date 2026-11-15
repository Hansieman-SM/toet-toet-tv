#!/bin/bash
# Short: 10 Twinkling Stars – "Ten twinkling stars!", a shooting star, count 1–10 again, the moon rises, "Good night, stars!" and The Big Four
# fall asleep (from ep/learn08_stars.js, 84.3–121.6 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-15-short-twinkling-stars; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn08_stars.js $O/audio.wav
OW=2560 OH=1440 node ep/learn08_stars.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 84.3 -t 37.3 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=36.3:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=35.8:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "10 Twinkling Stars" --sub "Count at bedtime with The Big Four" --colors "#eef0ff,#5b5fc7" --thumb-at 4.5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
