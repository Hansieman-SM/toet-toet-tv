#!/bin/bash
# Short: Who Is the Biggest? – The Big Four line up from big to biggest, plus a tiny mouse (from ep/e6_grootst_en.js, 3–58.5 s, full 16:9 frame)
set -e; S=2026-11-02-short-who-is-the-biggest; O=release/$S; mkdir -p $O
python3 ep/e6_grootst.py $O/audio.wav > /dev/null
OW=2560 OH=1440 node ep/e6_grootst_en.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 3 -t 55.5 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=54.5:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=54:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Who Is the Biggest?" --sub "Big, bigger, biggest!" --colors "#fde7b0,#e0a458"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
