#!/bin/bash
# Learning series – ABC #5 (EN): Winter ABC with Little Truck Toet (ep/learn14_winter_abc.js: Toet parks by a snowy park on a bright
# winter day – soft winter sun, snowy hills and pines, a frozen pond with ice sparkles, a snow-capped bench, gently falling snow; per letter
# (5 s) alphabet strip, snow-capped letter block, picture card with a gently moving original winter drawing + word card with coloured first
# letter, Toet says "A is for Arctic fox!": Arctic fox, Boots, Cocoa, Deer, Earmuffs, Fireplace, Gloves, Hedgehog, Igloo, Jacket, Kettle,
# Lantern, Mitten, Narwhal, Otter, Pinecone, Quilt, Robin, Snowman, Toboggan, Umbrella, Village, Walrus, Xylophone, Yarn, Zipper; recap A–Z;
# new music winterabc_long: glockenspiel lead, hammered-dulcimer broken chords, soft reedy bassoon bass, light jingle; G major 3/4 waltz)
set -e; S=2026-11-23-learn-winter-abc; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/learn14_winter_abc.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/learn14_winter_abc.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=104.8 OW=1280 OH=720 node ep/learn14_winter_abc.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Winter ABC" "Learn the Alphabet with Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
