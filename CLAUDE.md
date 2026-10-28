# Toet Toet and Friends TV – instructions for Claude

Owner: Hans (speaks Dutch – talk to him in Dutch). Channel: https://www.youtube.com/@ToetToetAndFriends (made for kids, ages 0–6).

## Hard rules
- **Everything published is in English**: titles, descriptions, tags, thumbnails, on-screen text. (Older Dutch videos stay as they are.)
- **Publishing (authorised by Hans, 2026-10-26):** videos are scheduled automatically on YouTube via Metricool (brand blogId 7587077, timezone Europe/Amsterdam), always at least ~1 day ahead, so Hans can check and delete them in the Metricool app (veto window). Always tell Hans what was scheduled, when, with the plannerUrl. Never publish immediately, never delete or change videos that are already live.
- **No duplicates.** Check CATALOG.md before making anything; every new video gets a line there. Never re-render an existing theme/episode as "new".
- **Quality over quantity** (YouTube "inauthentic/mass-produced content" policy, July 2025). Every video must be clearly different: new scene, new animals/characters, new music. No near-copies.
- All music and visuals are original code. No copyrighted characters, songs or melodies.
- Truckje Toet / Little Truck Toet is an **electric** truck (no exhaust).
- Metricool accepts max 500 MB per YouTube video; tools/long.sh targets ~480 MB for 90 min.

## Pipeline
- `npm install` (needs @napi-rs/canvas), Python3 with numpy + scipy, ffmpeg.
- World is 960x540. **Render episodes and Short sources at 2560x1440** (`OW=2560 OH=1440 node ...`, ffmpeg `-s 2560x1440`, `-preset slow -tune animation -crf 16` for episodes, `-crf 12` for Short sources) – YouTube gives 1440p uploads much sharper encodes (Hans wants razor-sharp video). Long calm videos stay 1920x1080 (tools/long.sh, 600k, < 480 MB because Metricool's YouTube limit is 500 MB). Font: fonts/Baloo2.ttf via lib/common.js.
- Env: `STILL=<sec> node ep/x.js out.png` for a still; `DUR`, `FADEIN=1`, `FADEOUT=1`, `T0`.
- Calm long videos: scene file where everything is periodic in P=240 s (see ep/ocean.js, ep/sensory.js), music script `python3 ep/<x>_music.py out.wav SECONDS` (see ep/ocean_music.py, ep/bw_long_music.py). Build with `tools/long.sh ep/scene.js "python3 ep/scene_music.py" out/<slug> 90`.
- Thumbnails 1280x720: `STILL=5 OW=1280 OH=720 node ep/scene.js bg.png` then `OW=1280 OH=720 node tools/thumb2.js bg.png thumb.png "Title" "subtitle"`.
- Shorts: vertical 1440x2560, ≤ 60 s, made with tools/short.py from a 2560x1440 source. Default = the WHOLE 16:9 frame (nothing cut off). `--crop --cx N` (4:3 crop) is ONLY allowed for footage without any text, speech bubbles or titles (e.g. calm scenes) and only if the QC sheet shows nothing cut.
- **QC is mandatory before scheduling anything (Hans, 2026-10-28: cut-off text is unprofessional and not allowed):** run `tools/qc.sh <video> <sheet.png>` on EVERY final video (also the released file from Actions) and look at the sheet. Reject and fix if any text, speech bubble, title, number or character is cut off, touches the frame edge, overlaps another text, or is unreadable. Only schedule after a clean QC. Never report a known visual problem to Hans as "acceptable" – fix it first.
- Always look at stills/contact sheets of what you render before delivering (check overlaps, seams, fades).

## Render + publish flow
1. Write the new scene/episode code and a job script `jobs/<YYYY-MM-DD>-<type>-<slug>.sh` that renders everything into `release/<job name>/` (final .mp4 + thumbnail .png/.jpg for long videos and episodes). See jobs/2026-10-27-short-under-the-sea.sh. Test short pieces locally first (stills!).
2. Commit + push to main. GitHub Actions (.github/workflows/render.yml) runs every new/changed jobs/*.sh and publishes a GitHub release with tag = job name. Public download URL: `https://github.com/Hansieman-SM/toet-toet-tv/releases/download/<job>/<file>`.
3. Wait for the Actions run (`gh api repos/Hansieman-SM/toet-toet-tv/actions/runs`), check it succeeded, download the result and check frames.
4. Schedule with Metricool createScheduledPost: providers youtube; youtubeData {title, type "short"|"video", privacy public, tags, category FILM_ANIMATION, madeForKids true, isAiGeneratedContent false}; media = release URL; videoThumbnailUrl = thumbnail release URL for long videos/episodes (the channel is phone-verified, so custom thumbnails should work; if Metricool still rejects the thumbnail, schedule without it and tell Hans to set it in YouTube Studio).
5. Times (Europe/Amsterdam), next day: Shorts 12:00 and 17:00, episodes 16:00, long calm videos 18:30. Never two posts at the same time; check getScheduledPosts first so nothing is scheduled twice.
6. **TikTok** (account @toet.friends, connected in Metricool since 2026-10-27): schedule EVERY vertical Short also on TikTok as a separate Metricool post (providers [{"network":"tiktok"}]), 30 minutes after its YouTube time (12:30 and 17:30). tiktokData: {privacyOption "PUBLIC_TO_EVERYONE", title (short), isAigc false, autoAddMusic false, comments/duet/stitch allowed}. Caption: 1–2 English sentences aimed at parents + "All music and animation is original." + 5–6 hashtags (e.g. #toddlerlearning #kidscartoon #babysensory #toddlermom #preschool + a topic tag). No long videos or 16:9 episodes on TikTok.
7. Add every item to CATALOG.md (date, title, Metricool post times for YouTube and TikTok).

## Daily batch (scheduled task, every day 07:31 Europe/Amsterdam)
- Mon + Thu: 1 new 90-min calm video (new theme) + thumbnail.
- Tue, Wed, Fri, Sat: 1 new English story episode (2–3 min) with Little Truck Toet or The Big Four + thumbnail.
- Every day: 2 new vertical Shorts (≤ 60 s) via tools/short.py.
- Always: quality check, English texts, render via Actions, schedule via Metricool for the next day, update CATALOG.md, commit + push, send Hans a short Dutch summary of what is scheduled when (with planner links).
- Speech bubbles are clamped 40 px (world units) from the frame edge in lib/common.js bubble(); still place them sensibly.
- ffmpeg on the GitHub runner is strict: write decimals with a leading zero in filters (`d=0.6`, never `d=.6`), otherwise it exits with code 234.
