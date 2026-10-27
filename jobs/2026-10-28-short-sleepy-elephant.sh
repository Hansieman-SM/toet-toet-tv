#!/bin/bash
# Short: Sleepy Elephant – calm lullaby (from ep/sensory.js, first 45 s: mama peeks, shooting star)
set -e; S=2026-10-28-short-sleepy-elephant; O=release/$S; mkdir -p $O
python3 ep/bw_long_music.py $O/music.wav 45
FADE=1 DUR=45 node ep/sensory.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -af "afade=out:st=41:d=4" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Sleepy Elephant" --sub "A calm lullaby for babies" --cx 960 --colors "#cfc6ee,#4b4380"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
