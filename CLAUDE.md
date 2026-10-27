# Toet Toet and Friends TV – instructions for Claude

Owner: Hans (speaks Dutch – talk to him in Dutch). Channel: https://www.youtube.com/@ToetToetAndFriends (made for kids, ages 0–6).

## Hard rules
- **Everything published is in English**: titles, descriptions, tags, thumbnails, on-screen text. (Older Dutch videos stay as they are.)
- **Publishing (authorised by Hans, 2026-10-26):** videos are scheduled automatically on YouTube via Metricool (brand blogId 7587077, timezone Europe/Amsterdam), always at least ~1 day ahead, so Hans can check and delete them in the Metricool app (veto window). Always tell Hans what was scheduled, when, with the plannerUrl. Never publish immediately, never delete or change videos that are already live.
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

## Render + publish flow
1. Write the new scene/episode code and a job script `jobs/<YYYY-MM-DD>-<type>-<slug>.sh` that renders everything into `release/<job name>/` (final .mp4 + thumbnail .png/.jpg for long videos and episodes). See jobs/2026-10-27-short-under-the-sea.sh. Test short pieces locally first (stills!).
2. Commit + push to main. GitHub Actions (.github/workflows/render.yml) runs every new/changed jobs/*.sh and publishes a GitHub release with tag = job name. Public download URL: `https://github.com/Hansieman-SM/toet-toet-tv/releases/download/<job>/<file>`.
3. Wait for the Actions run (`gh api repos/Hansieman-SM/toet-toet-tv/actions/runs`), check it succeeded, download the result and check frames.
4. Schedule with Metricool createScheduledPost: providers youtube; youtubeData {title, type "short"|"video", privacy public, tags, category FILM_ANIMATION, madeForKids true, isAiGeneratedContent false}; media = release URL; videoThumbnailUrl = thumbnail release URL for long videos/episodes (the channel is phone-verified, so custom thumbnails should work; if Metricool still rejects the thumbnail, schedule without it and tell Hans to set it in YouTube Studio).
5. Times (Europe/Amsterdam), next day: Shorts 12:00 and 17:00, episodes 16:00, long calm videos 18:30. Never two posts at the same time; check getScheduledPosts first so nothing is scheduled twice.
6. Add every item to CATALOG.md (date, title, Metricool post time).

## Daily batch (scheduled task, every day 07:31 Europe/Amsterdam)
- Mon + Thu: 1 new 90-min calm video (new theme) + thumbnail.
- Tue, Wed, Fri, Sat: 1 new English story episode (2–3 min) with Little Truck Toet or The Big Four + thumbnail.
- Every day: 2 new vertical Shorts (≤ 60 s) via tools/short.py.
- Always: quality check, English texts, render via Actions, schedule via Metricool for the next day, update CATALOG.md, commit + push, send Hans a short Dutch summary of what is scheduled when (with planner links).
- ffmpeg on the GitHub runner is strict: write decimals with a leading zero in filters (`d=0.6`, never `d=.6`), otherwise it exits with code 234.
