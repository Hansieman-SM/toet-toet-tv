#!/bin/bash
# Short: Rainy Day Splash! – rain, Nico jumps in 1-2-3 puddles, the rainbow and its six colours (from ep/en04_weather.js, 80–131 s, full 16:9 frame)
set -e; S=2026-11-01-short-rainy-day-splash; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en04_weather.js $O/audio.wav
OW=2560 OH=1440 node ep/en04_weather.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/full.mp4
ffmpeg -v error -y -ss 80.0 -t 51 -i $O/full.mp4 -vf "fade=in:st=0:d=0.5,fade=out:st=50:d=1" -af "afade=in:st=0:d=0.5,afade=out:st=49.5:d=1.5" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Rainy Day Splash!" --sub "1, 2, 3 puddles & a rainbow!" --colors "#d7e9f7,#3a86ff"
rm -f $O/full.mp4 $O/src.mp4 $O/audio.wav $O/*.bg.png
