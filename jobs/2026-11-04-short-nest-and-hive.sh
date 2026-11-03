#!/bin/bash
# Short: Who Lives Here? – mama bird flies home to her nest, busy bees at their hive (from ep/en05_homes.js, 20.5–70.5 s, full 16:9 frame)
set -e; S=2026-11-04-short-nest-and-hive; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en05_homes.js $O/audio.wav
OW=2560 OH=1440 node ep/en05_homes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 20.5 -t 50 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=49:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=48.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Who Lives Here?" --sub "A nest and a hive!" --colors "#d6f0ff,#e8735a"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
