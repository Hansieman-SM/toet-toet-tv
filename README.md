# Toet Toet and Friends TV – video pipeline

Original animations + music for the YouTube channel @ToetToetAndFriends.
Everything is generated in code: Node.js (@napi-rs/canvas) for frames, Python (numpy/scipy) for music and sound, ffmpeg for encoding.

- `lib/` – shared drawing (Toet world, safari, kids, friends, story system) and audio libraries
- `ep/` – episodes, sensory/long videos (`sensory.js`, `ocean.js`) and their music scripts
- `tools/` – thumbnails, Shorts
- Env: `STILL=<s>` png, `DUR`, `FADEIN/FADEOUT`, `OW/OH`, `EVENTS=1` (audio events)

Rule: nothing is published without the owner's approval.
