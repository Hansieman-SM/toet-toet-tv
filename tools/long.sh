#!/bin/bash
# Bouwt een lange naadloze video (standaard 1,5 uur) uit een periodieke scène (P=240 s).
# Gebruik: tools/long.sh ep/scene.js "python3 ep/music.py" out/naam [MINUTEN]
# Resultaat: out/naam/<naam>.mp4 (< 480 MB: Metricool-limiet voor YouTube is 500 MB), plus intro/loop/outro.
set -e
SCENE=$1; MUSIC=$2; OUT=$3; MIN=${4:-90}
SEC=$((MIN*60)); N=$(( (SEC-360)/240 ))
mkdir -p $OUT; NAME=$(basename $OUT)
R="-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30"
FADEIN=1 DUR=240 node $SCENE | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - $R $OUT/raw_intro.mp4 &
DUR=240 node $SCENE | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - $R $OUT/raw_loop.mp4 &
FADEOUT=1 DUR=120 node $SCENE | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 1920x1080 -r 30 -i - $R $OUT/raw_outro.mp4 &
$MUSIC $OUT/music.wav $SEC > $OUT/music.log &
wait
O="-c:v libx264 -preset slow -tune animation -b:v 600k -pix_fmt yuv420p -r 30 -g 300 -an"
for f in intro loop outro; do (ffmpeg -v error -y -i $OUT/raw_$f.mp4 $O -pass 1 -passlogfile $OUT/p_$f -f mp4 /dev/null && ffmpeg -v error -y -i $OUT/raw_$f.mp4 $O -pass 2 -passlogfile $OUT/p_$f $OUT/$f.mp4) & done; wait
(echo "file 'intro.mp4'"; for i in $(seq $N); do echo "file 'loop.mp4'"; done; echo "file 'outro.mp4'") > $OUT/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $OUT/list.txt -i $OUT/music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 112k -shortest $OUT/$NAME.mp4
rm -f $OUT/p_* $OUT/raw_*.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 $OUT/$NAME.mp4
