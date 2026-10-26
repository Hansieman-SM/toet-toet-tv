# Toet Toet and Friends TV – instructions for Claude

Owner: Hans (speaks Dutch – talk to him in Dutch). Channel: https://www.youtube.com/@ToetToetAndFriends (made for kids, ages 0–6).

## Hard rules
- **Everything published is in English**: titles, descriptions, tags, thumbnails, on-screen text. (Older Dutch videos stay as they are.)
- **Never publish or schedule anything public without Hans's approval.** Deliver files + texts; Hans uploads (or approves a Metricool draft).
- **No duplicates.** Check CATALOG.md before making anything; every new video gets a line there. Never re-render an existing theme/episode as "new".
- **Quality over quantity** (YouTube "inauthentic/mass-produced content" policy, July 2025). Every video must be clearly different: new scene, new animals/characters, new music. No near-copies.
- All music and visuals are original code. No copyrighted characters, songs or melodies.
- Truckje Toet / Little Truck Toet is an **electric** truck (no exhaust).
- Uploads must stay under 400 MiB (file-send limit). tools/long.sh targets ~370 MiB for 90 min.

## Pipeline
- `npm install` (needs @napi-rs/canvas), Python3 with numpy + scipy, ffmpeg.
- World is 960x540, rendered at 1920x1080 (OW/OH env for other sizes). Font: fonts/Baloo2.ttf via lib/common.js.
- Env: `STILL=<sec> node ep/x.js out.png` for a still; `DUR`, `FADEIN=1`, `FADEOUT=1`, `T0`.
- Calm long videos: scene file where everything is periodic in P=240 s (see ep/ocean.js, ep/sensory.js), music script `python3 ep/<x>_music.py out.wav SECONDS` (see ep/ocean_music.py, ep/bw_long_music.py). Build with `tools/long.sh ep/scene.js "python3 ep/scene_music.py" out/<slug> 90`.
- Thumbnails 1280x720: `STILL=5 OW=1280 OH=720 node ep/scene.js bg.png` then `OW=1280 OH=720 node tools/thumb2.js bg.png thumb.png "Title" "subtitle"`.
- Shorts: vertical 1080x1920, ≤ 60 s, tools/shorts.py shows the approach.
- Always look at stills/contact sheets of what you render before delivering (check overlaps, seams, fades).

## Weekly batch (scheduled task)
1. Read CATALOG.md, pick a NEW theme not used before.
2. Make 1 new long calm video (90 min) with new scene + new music, plus English thumbnail.
3. Make 3 vertical Shorts (≤ 60 s) from new material (e.g. close-ups of the new scene, or a short new Toet/Big Four moment in English).
4. Write English title, description, tags for each, and the playlist it belongs in.
5. Commit code + CATALOG.md (no media) and push to main.
6. Send Hans the files and texts, with a short Dutch summary.
