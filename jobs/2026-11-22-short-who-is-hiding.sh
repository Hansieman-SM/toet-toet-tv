#!/bin/bash
# Short: Can You Find It? – Who is hiding? Forest friends peek out behind a leaf pile, a log and a bush; find the BUNNY (long ears), the
# SQUIRREL (bushy tail) and the HEDGEHOG (prickly spikes) with 3-dot pauses (from ep/learn13_find_animals.js, 12.8–52.8 s, full 16:9 frame –
# contains text + speech bubbles, so no crop)
set -e; S=2026-11-22-short-who-is-hiding; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn13_find_animals.js $O/audio.wav
OW=2560 OH=1440 node ep/learn13_find_animals.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 12.8 -t 40 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=39:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=38.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Who Is Hiding?" --sub "Can you find the forest friends?" --colors "#fff4e4,#d9772e" --thumb-at 8.6
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
