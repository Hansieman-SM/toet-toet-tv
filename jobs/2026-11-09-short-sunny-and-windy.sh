#!/bin/bash
# Short: Sunny or Windy? – sunny and hot (Ella sprays cool water on her friends), then windy (leaves fly, everyone leans, Boris's kite flies)
# (from ep/en04_weather.js, 22.0–79.6 s, full 16:9 frame; the rain/rainbow part 80–131 s was already the Short "Rainy Day Splash!")
set -e; S=2026-11-09-short-sunny-and-windy; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en04_weather.js $O/audio.wav
OW=2560 OH=1440 node ep/en04_weather.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 22.0 -t 57.6 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=56.6:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=56.1:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Sunny or Windy?" --sub "Splash! Whoosh! What's the weather?" --colors "#fff4c2,#3a86ff"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
