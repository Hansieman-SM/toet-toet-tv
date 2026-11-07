#!/bin/bash
# Episode (EN): The Big Four – Fruit Picnic! (ep/en08_picnic.js: Ella unrolls a picnic blanket; Leo brings 3 red apples, Nico 4 yellow bananas,
# Boris 2 bunches of purple grapes; Ella's surprise: a big green watermelon, red inside – too big for one, so one slice for everyone (1-2-3-4), let's share!;
# sunset recap of fruits + colours; new Celtic-style jig music picnic_long: tin whistle, musette accordion, bodhran, bouzouki + sfx munch/crack)
set -e; S=2026-11-08-episode-fruit-picnic; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en08_picnic.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en08_picnic.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=104.9 OW=1280 OH=720 node ep/en08_picnic.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Fruit Picnic!" "Apples, bananas, grapes & watermelon"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
