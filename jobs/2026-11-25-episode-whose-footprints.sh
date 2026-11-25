#!/bin/bash
# Episode (EN): The Big Four – Whose Footprints? (ep/en16_footprints.js). After the rain the savanna path is muddy; Ella: "Let's play a
# footprint game!" – per round a trail of prints appears step by step, a big copy pops up in a card, "Whose footprints?", 3-dot pause,
# then the owner hops forward: Leo's soft PAWS (four toes), Ella's BIG ROUND feet, Boris's HOOVES, Nico's THREE TOES. Then tiny prints
# lead to a bush – Tilly the Turtle (new character) walks out: "Can I play with you?" – "Yes! Come and play!" (being kind, including others).
# Sunset recap card: five friends, five kinds of feet. New music footprints_long: bouncy 6/8 puddle jig in E-flat (oboe, tuba, pizzicato,
# woodblock footsteps, glockenspiel, mud plops).
# rev2: recap shot 3 s longer so Tilly's "Thank you, friends!" bubble is gone before the end card + subscribe pill.
set -e; S=2026-11-25-episode-whose-footprints; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en16_footprints.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en16_footprints.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=90.5 OW=1280 OH=720 node ep/en16_footprints.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Whose Footprints?" "Guess the feet with The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
