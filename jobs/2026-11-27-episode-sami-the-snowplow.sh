#!/bin/bash
# Episode (EN): Toet's Helper Friends – Sami the Snowplow (ep/en17_snowplow.js). The first snow of winter: drifts on the road and
# Little Truck Toet's wheels just spin (whirr!). Sami the Snowplow (new character: blue ELECTRIC snowplow, lightning badge, orange striped
# blade, flashing amber roof light, salt box with a snowflake) plows her way in and throws the five drifts onto the roadside one by one –
# count 1 to 5 (numeral + number word), recap "Five snow piles!", "Thank you, Sami!", she reverses away (beep beep), Toet drives on past a
# little snowman. New snow mode for the Toet world (lib/toet.js world({snow})). New music snowplow_long: cornet polka in G, tuba oom-pah,
# offbeat reed chords, sleigh bells, glockenspiel.
set -e; S=2026-11-27-episode-sami-the-snowplow; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en17_snowplow.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en17_snowplow.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=62.7 OW=1280 OH=720 node ep/en17_snowplow.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Sami the Snowplow" "Count the snow piles with Toet!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
