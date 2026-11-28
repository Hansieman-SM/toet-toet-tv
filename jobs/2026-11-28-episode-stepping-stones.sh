#!/bin/bash
# rev2 (QC): at the end the friends walk off into the meadow before the subscribe pill appears (no overlap with characters)
# Episode (EN): The Big Four – Stepping Stones (ep/en18_stones.js). Tilly the Turtle calls from across a little river; the friends count
# the five stepping stones 1–5; Nico hops across, Boris clip-clops after him, big Ella wades through the water (splash!). Leo stays behind:
# "I'm scared…" – Ella comes back and stands in the water next to the stones ("Let's go together!"), Nico cheers, Leo hops across slowly
# while everybody counts 1-2-3-4-5 – "I did it!" BRAVE. Recap in Tilly's flower meadow (five stones, scared → brave), "Friends help friends!"
# New music stones_long: marimba lead, pizzicato strings, soft tuba, woodblock hops (F major).
set -e; S=2026-11-28-episode-stepping-stones; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en18_stones.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en18_stones.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
# thumbnail background: Leo halfway across the stones, Ella in the water beside him (zoomed crop of the 2560 frame)
THUMBBG=1 STILL=97.6 OW=2560 OH=1440 node ep/en18_stones.js $O/big.png
ffmpeg -v error -y -i $O/big.png -vf "crop=1387:780:1110:640,scale=1280:720:flags=lanczos" $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Stepping Stones" "Leo is brave! · The Big Four"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png $O/big.png
