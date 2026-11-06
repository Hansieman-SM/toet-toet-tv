#!/bin/bash
# Short: Safari Babies – black & white baby elephant, rhino calf, tortoise and flamingo (from ep/bwd_safari.js, loop T0=144, 45 s; no text in the source, full 16:9 frame)
set -e; S=2026-11-07-short-safari-babies; O=release/$S; mkdir -p $O
python3 ep/bwd_safari_music.py $O/music.wav 45
FADEIN=1 FADEOUT=1 DUR=45 T0=144 OW=2560 OH=1440 node ep/bwd_safari.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -af "afade=out:st=41:d=4" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Safari Babies" --sub "Black & white for babies" --colors "#f2f2f2,#3a3a3a"
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
