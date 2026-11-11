#!/bin/bash
# Learning series – ABC #2 (EN): Animal ABC with The Big Four (ep/learn04_animal_abc.js: Leo, Ella, Nico and Boris stand on the savanna; per letter (5 s)
# the alphabet strip lights the current letter, a letter block (upper + lower case) pops up with an animal picture card + word card with coloured first letter,
# and one of the friends says "A is for Alligator!"; A Alligator, B Buffalo (Boris: "like me!"), C Cat, D Dog, E Elephant (Ella), F Frog, G Giraffe, H Hippo,
# I Iguana, J Jellyfish, K Kangaroo, L Lion (Leo), M Monkey, N Newt, O Octopus, P Penguin, Q Quail, R Rhino (Nico), S Snake, T Turtle, U Umbrellabird,
# V Vulture, W Whale, X X-ray fish, Y Yak, Z Zebra; recap with 26 animal tiles, goodbye;
# new music animal_abc_long: balafon lead, plucked bass, offbeat kalimba chords, djembe + shaker, D major)
set -e; S=2026-11-12-learn-animal-abc; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn04_animal_abc.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn04_animal_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=33.5 OW=1280 OH=720 node ep/learn04_animal_abc.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Animal ABC" "Learn A to Z with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
