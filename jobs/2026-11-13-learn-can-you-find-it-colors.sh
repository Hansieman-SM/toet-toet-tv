#!/bin/bash
# Learning series – "Can You Find It?" #1 (EN): Colors with Little Truck Toet (ep/learn05_find_colours.js: Toet parks by the road and plays
# a finding game; per colour (13 s) three picture cards pop up, the colour word appears in its own colour, Toet asks "Can you find something RED?",
# a quiet 3-dot pause (one dot per second, soft tick) so children can point, then the answer: the right card glows and bounces, the others fade,
# the word appears on the card and Toet says "Yes! The apple is red!"; red apple, blue umbrella, yellow duck, green leaf, orange carrot,
# purple grapes; recap of the 6 colours, Toet drives off; new music findit_long: harmonica lead, fingerpicked arpeggios, walking bass,
# brushes + triangle, F major shuffle)
set -e; S=2026-11-13-learn-can-you-find-it-colors; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn05_find_colours.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn05_find_colours.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=20.7 OW=1280 OH=720 node ep/learn05_find_colours.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Can You Find It?" "Learn colors with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
