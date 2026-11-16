#!/bin/bash
# Learning series – "Can You Find It?" #2 (EN): Shapes with The Big Four (ep/learn09_find_shapes.js: sunny savanna by a little waterhole;
# per shape (13 s) three picture cards pop up out of three little bushes, the shape word appears at the top with the shape outline drawing
# itself next to it, one of the friends asks "Can you find a CIRCLE?", a quiet 3-dot pause (one dot per second, soft tick) so children can
# point, then the answer: the right card glows and bounces, the others fade, the word appears on the card and the friend says
# "Yes! The clock is a circle!"; circle (clock), square (window), triangle (party hat), star (starfish), heart (heart balloon), oval (egg);
# recap of the 6 shapes, the friends cheer and walk off; new music shapehunt_long: oboe lead, hammered-dulcimer arpeggios, plucked upright
# bass, udu clay pot + shaker, gentle highlife lilt in E major)
set -e; S=2026-11-16-learn-can-you-find-it-shapes; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn09_find_shapes.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn09_find_shapes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=57 OW=1280 OH=720 node ep/learn09_find_shapes.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Can You Find It?" "Shapes with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
