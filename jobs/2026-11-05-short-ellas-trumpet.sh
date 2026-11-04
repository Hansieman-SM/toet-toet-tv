#!/bin/bash
# Short: Ella's Trumpet – Ella has no instrument and feels sad, her friends say her trunk can be a trumpet: TOOT! Then the band plays together
# rev2: ends at 137 s (before the instrument recap starts popping in)
# (from ep/en06_music.js, 90–137 s, full 16:9 frame)
set -e; S=2026-11-05-short-ellas-trumpet; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en06_music.js $O/audio.wav
OW=2560 OH=1440 node ep/en06_music.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 90 -t 47 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=46:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=45.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Ella's Trumpet" --sub "Toot! Let's play together!" --colors "#f6f0ff,#9b5de5"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
