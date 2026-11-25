#!/bin/bash
# Learning series #18 – ABC #6 (EN): Toy ABC with The Big Four (ep/learn18_toy_abc.js: a cosy toy corner on the savanna – round striped
# play rug + small open wooden toy chest; per letter (5 s) alphabet strip, wooden toy letter block (upper + lower case), picture card with
# a gently moving original toy (all with eyes + smile: Airplane, Ball, Car, Drum, Elephant plush, Flute, Guitar, rocking Horse,
# Ice cream cart, Jack-in-the-box, Kite, Lion puppet, Maracas, Nesting dolls, Octopus plush, Puzzle, Quilt, Robot, Spinning top,
# Teddy bear, Unicorn plush, Violin, Wagon, Xylophone, Yo-yo, Zebra on wheels), word card with coloured first letter, the friends take
# turns ("E is for Elephant! Like me!" – Ella; "L is for Lion puppet! Like me! Roar!" – Leo), a mini copy of each toy hops out of the
# chest onto the rug; recap 26 tiles, "Well done!"; new music toyabc_long: wind-up-toy shuffle in A-flat – kalimba lead,
# clockwork tick-tock, toy tom, string pad, soft bass, spring boing + bell tree)
set -e; S=2026-11-25-learn-toy-abc; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn18_toy_abc.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn18_toy_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=108.5 OW=1280 OH=720 node ep/learn18_toy_abc.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Toy ABC" "Learn the Alphabet with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
