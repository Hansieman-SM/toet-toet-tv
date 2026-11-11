#!/bin/bash
# Short: Try Again! – The Big Four's first tower wobbles and falls (CRASH!), "Let's try again!", Ella's idea: big blocks at the bottom, small on top
# (from ep/en10_tower.js, 30.5–75.5 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-12-short-try-again; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en10_tower.js $O/audio.wav
OW=2560 OH=1440 node ep/en10_tower.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 30.5 -t 45.0 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44.0:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Try Again!" --sub "Big blocks at the bottom!" --colors "#fff6ea,#e63946"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
