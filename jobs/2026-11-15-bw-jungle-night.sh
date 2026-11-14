#!/bin/bash
# Daily B&W sensory #13 (90 min): Jungle Night – ep/bwd_jungle.js (white jungle friends with happy faces: sloth hanging from a branch, toucan with a
# striped beak, tree frog with toe pads and a puffing throat, tiger cub with bold stripes and a swishing tail, parrot flying with a long striped
# tail, chameleon with a curly tail and a turning eye, friendly snake looped over a branch, big leaf with holes, monkey swinging on a vine and
# waving, firefly with a glowing tail in soft rings; hanging vines, twinkling stars, drifting firefly dots, ferns + grass; outro: the sloth asleep
# hugging its branch under a crescent moon, z z z) + ep/bwd_jungle_music.py (flute/guitar/cello + night crickets, 4/4, C#). Last 20 min slowly dimmer.
set -e; S=2026-11-15-bw-jungle-night; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_jungle.js "python3 ep/bwd_jungle_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=54 OW=1280 OH=720 node ep/bwd_jungle.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Jungle Night" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
