#!/bin/bash
# Short: Sami the Snowplow – count the snow piles: Sami throws five snow drifts onto the roadside one by one (1–5 with numeral + word),
# then the numbers over the piles and "Five snow piles!" (from ep/en17_snowplow.js, 46.8–95.8 s, full 16:9 frame – contains text + speech
# bubbles, so no crop)
set -e; S=2026-11-27-short-sami-the-snowplow; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en17_snowplow.js $O/audio.wav
OW=2560 OH=1440 node ep/en17_snowplow.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 46.8 -t 49 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=48:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=47.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Sami the Snowplow" --sub "Count the snow piles with Toet!" --colors "#e7f1fb,#1c5bb0" --thumb-at 7
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
