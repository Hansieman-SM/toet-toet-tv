#!/bin/bash
# Short: Wheee, Downhill! – Toet reaches the top, battery almost empty, rolls downhill and charges up: FULL! (from ep/av03_berg_en.js, 56.4–115.8 s, full 16:9 frame)
set -e; S=2026-11-03-short-downhill-power; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/av03_berg_en.js $O/audio.wav
OW=2560 OH=1440 node ep/av03_berg_en.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 56.4 -t 59.4 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=58.4:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=57.9:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Wheee, Downhill!" --sub "Watch Toet's battery fill up!" --colors "#dff1ff,#7fc3ef"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
