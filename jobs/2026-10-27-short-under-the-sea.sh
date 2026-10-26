#!/bin/bash
# Short: Under the Sea – who swims by? (from ep/ocean.js)
set -e; S=2026-10-27-short-under-the-sea; O=release/$S; mkdir -p $O
python3 ep/ocean_music.py $O/music.wav 40
FADE=1 DUR=40 T0=20 node ep/ocean.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Under the Sea" --sub "Who swims by?" --cx 900 --colors "#bfe6f0,#4b6aa6"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
