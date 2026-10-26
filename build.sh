#!/bin/bash
# gebruik: ./build.sh <naam> <thumbtijd>   (ep/<naam>.js + ep/<naam>.py)
set -e
cd "$(dirname "$0")"
N=$1; TT=$2
python3 ep/$N.py out/$N.wav
node ep/$N.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - -i out/$N.wav -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest out/$N.mp4
THUMB=$TT OW=1280 OH=720 node ep/$N.js out/$N-thumbnail.png
echo "klaar $N"
