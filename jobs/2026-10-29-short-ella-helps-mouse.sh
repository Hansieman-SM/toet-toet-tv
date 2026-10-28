#!/bin/bash
# Short: Ella Helps Mouse – one, two, three, too high! (from ep/en02_kind.js, 52–101 s)
set -e; S=2026-10-29-short-ella-helps-mouse; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en02_kind.js $O/audio.wav
node ep/en02_kind.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i $O/audio.wav -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 52.4 -t 48.6 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=47.6:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=47.1:d=1.5" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Ella Helps Mouse" --sub "Sad or happy?" --cx 1120 --colors "#ffe3a8,#e8701f"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
