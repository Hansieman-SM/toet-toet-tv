#!/bin/bash
# Episode (EN): The Big Four – What's the Weather? (ep/en04_weather.js: sunny/hot, windy + kite, rainy + 1-2-3 puddles, rainbow colours, recap; new calypso music weather_long: steel pan, ukulele, marimba, congas)
set -e; S=2026-11-01-episode-whats-the-weather; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en04_weather.js $O/audio.wav
OW=2560 OH=1440 node ep/en04_weather.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=131.05 OW=1280 OH=720 node ep/en04_weather.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "What's the Weather?" "Sunny, windy, rainy – with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
