#!/bin/bash
# Short: Starry Space Trip – wave hello to the bunny astronaut! (bunny hops on the moon, rocket with bear cub orbits the Earth, puppy in a
# flying saucer, kitten asleep in the moon hammock) – from ep/space.js, loop T0=24, 45 s; no text in the source, full 16:9 frame
set -e; S=2026-11-16-short-starry-space-trip; O=release/$S; mkdir -p $O
python3 ep/space_music.py $O/music.wav 45
FADEIN=1 FADEOUT=1 DUR=45 T0=24 OW=2560 OH=1440 node ep/space.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/music.wav -map 0:v -map 1:a -af "afade=out:st=41:d=4" -c:v libx264 -preset slow -tune animation -crf 12 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $O/src.mp4
python3 tools/short.py $O/src.mp4 $O/$S.mp4 --title "Starry Space Trip" --sub "Wave hello to the bunny astronaut!" --colors "#fff3d6,#5b4fa8" --thumb-at 8
rm -f $O/src.mp4 $O/music.wav $O/*.bg.png
