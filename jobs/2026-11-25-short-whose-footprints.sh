#!/bin/bash
# Short: Whose Footprints? – guess the footprints with The Big Four: Leo's paws, Ella's big round feet, Boris's hooves (trail appears in
# the mud, big print card, "Whose footprints?", 3-dot pause, the owner hops forward) (from ep/en16_footprints.js, 18.8–63.8 s,
# full 16:9 frame – contains text + speech bubbles, so no crop)
set -e; S=2026-11-25-short-whose-footprints; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en16_footprints.js $O/audio.wav
OW=2560 OH=1440 node ep/en16_footprints.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 18.8 -t 45 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=44:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=43.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Whose Footprints?" --sub "Guess the feet with The Big Four!" --colors "#fff1dc,#b5651d" --thumb-at 5
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
