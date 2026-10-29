#!/bin/bash
# Voice-over demo: Good Night, Toet (0-80 s) met drie Kokoro-vrouwenstemmen
set -e; S=voice-demo; O=release/$S; mkdir -p $O
sudo apt-get install -y -qq espeak-ng > /dev/null
pip install --quiet torch --index-url https://download.pytorch.org/whl/cpu
pip install --quiet "kokoro>=0.9" soundfile
python3 ep/mix.py ep/av10_welterusten_en.js $O/bed.wav
OW=2560 OH=1440 node ep/av10_welterusten_en.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -t 80 -c:v libx264 -preset medium -tune animation -crf 18 -pix_fmt yuv420p $O/video.mp4
for V in af_heart af_bella bf_emma; do
  python3 tools/voiceover.py ep/av10_welterusten_en.js $O/bed.wav $O/$V.wav --voice $V --until 78
  ffmpeg -v error -y -i $O/video.mp4 -i $O/$V.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t 80 -af "afade=out:st=77:d=3" -movflags +faststart $O/voice-demo-$V.mp4
done
rm -f $O/bed.wav $O/video.mp4 $O/*.wav
