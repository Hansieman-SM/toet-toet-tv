#!/bin/bash
# Short: Which One Is Different? – three rounds of the Big Four's finding game (apples + pear, ducks + frog, stars + heart) with the 3-dot
# pause and the answer (from ep/learn20_different.js, 12.6–52.6 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-27-short-which-one-is-different; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn20_different.js $O/audio.wav
OW=2560 OH=1440 node ep/learn20_different.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 12.6 -t 40 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=39:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=38.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Which One Is Different?" --sub "Can you find it?" --colors "#fff3e0,#e8590c" --thumb-at 9.5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
