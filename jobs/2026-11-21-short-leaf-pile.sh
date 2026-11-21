#!/bin/bash
# Short: Leaf Pile! – Ella makes one big pile, "One, two, three… JUMP!", Boris jumps in, leaves everywhere, they clean up together
# (from ep/en14_leafpile.js, 69.4–114.4 s, full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-21-short-leaf-pile; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en14_leafpile.js $O/audio.wav
OW=2560 OH=1440 node ep/en14_leafpile.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 69.4 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Leaf Pile!" --sub "One, two, three… JUMP!" --colors "#fff1dc,#e8702a" --thumb-at 8.8
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
