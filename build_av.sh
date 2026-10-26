#!/bin/bash
# ./build_av.sh <naam> <thumb-tijd>
cd "$(dirname "$0")"
N=$1; TT=$2
python3 ep/mix.py ep/$N.js out/avontuur/$N.wav > /dev/null || { echo "FOUT audio $N"; exit 1; }
DUR=$(EVENTS=1 node ep/$N.js | python3 -c "import json,sys; print(json.load(sys.stdin)['dur'])")
node ep/$N.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i out/avontuur/$N.wav -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest out/avontuur/$N.mp4 || { echo "FOUT video $N"; exit 1; }
THUMB=$TT OW=1280 OH=720 node ep/$N.js out/avontuur/$N-thumbnail.png
echo "klaar $N ($DUR s)"
