#!/bin/bash
# Kwaliteitscontrole: contactblad met een frame elke 2 s (max 30) van een video. Bekijk het ALTIJD voor publiceren:
# geen tekst/tekstballon/personage mag afgesneden zijn of tegen de rand plakken.
# Gebruik: tools/qc.sh video.mp4 out.png
set -e; V=$1; OUT=$2
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V"); N=$(python3 -c "print(min(30, max(1, int(float('$D')/2))))")
STEP=$(python3 -c "print(float('$D')/$N)")
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$V"); H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$V")
if [ "$H" -gt "$W" ]; then T=6x5; SC=270:-1; else T=5x6; SC=384:-1; fi
ffmpeg -v error -y -i "$V" -vf "fps=1/$STEP,scale=$SC,tile=$T:padding=4:color=red" -frames:v 1 "$OUT"
echo "$OUT ($N frames, duration $D s)"
