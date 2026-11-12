#!/bin/bash
# 90-min calm video: Dancing Fruit & Veggies (approved idea 2026-11-08: colourful fruit & veggies sensory, still calm) – a sunny pastel
# vegetable garden with a smiling sun and turning rays, drifting clouds (one with a face), soft hills with a little greenhouse, a white picket
# fence with a bluebird hopping along it, three nodding sunflowers and a watering can on a post that sprinkles sparkly drops. In two raised
# beds nine fruit & veggie friends sway gently to the music – corn, broccoli, tomato, eggplant, pumpkin at the back; carrot, strawberry,
# pea pod (three little peas with faces) and watermelon slice at the front – and in turn each one does a little solo (hop, arms up, happy
# eyes, floating music notes). Butterflies loop around, a snail strolls along the front (ep/veggies.js)
# + new music: wooden marimba melody, ukulele off-beat strums, round sine bass, warm 'ooh' choir pad, very soft shaker; garden breeze,
# a bee buzzing past now and then, a far-away sparrow (gently swinging 4/4, 84 bpm, G major; ep/veggies_music.py) + English thumbnail
set -e; S=2026-11-13-calm-dancing-fruit-and-veggies; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/veggies.js "python3 ep/veggies_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
STILL=10 OW=1280 OH=720 node ep/veggies.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Dancing Fruit & Veggies" "Calm Garden Music · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
