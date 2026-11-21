#!/bin/bash
# Episode (EN): The Big Four – Leaf Pile! (ep/en14_leafpile.js: a big autumn tree on the savanna drops its leaves; learning moment SORTING BY
# COLOUR + counting 1-2-3: Leo puts three red leaves in the red basket, Nico three yellow, Boris three orange; Ella sweeps the brown leaves
# into one BIG pile, Boris asks to jump, "One, two, three… JUMP!" – leaves fly everywhere, "Oops! Leaves everywhere!", they clean up
# TOGETHER; sunset recap red/yellow/orange, three of each; new music leafpile_long: autumn waltz in F – flugelhorn lead, guitar oom-pah-pah,
# glockenspiel, leaf-rustle shaker)
set -e; S=2026-11-21-episode-leaf-pile; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en14_leafpile.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en14_leafpile.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=78.0 OW=1280 OH=720 node ep/en14_leafpile.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Leaf Pile!" "Sort the colors – then JUMP!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
