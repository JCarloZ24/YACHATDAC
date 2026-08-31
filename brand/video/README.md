# Video

**The project holds exactly one video**, and it is not in this folder.

`Sample Video - Yachatdac.mp4` — **162 MB**, currently in the user's Downloads folder. It was
deliberately not copied in: at 162 MB it is a master, and masters do not belong in a repo or
in a folder that gets synced.

## Before it can be used

It is unusable as delivered. Risk **R11** records that no compression targets exist and that
the default outcome is the bad one — the above-the-fold budget is under 2.5 MB, and the
homepage is video-led.

To prepare a background loop:

```bash
# MP4 (H.264) — target roughly 1.2MB for a background loop
ffmpeg -i "Sample Video - Yachatdac.mp4" -vf "scale=1600:-2" -c:v libx264 -crf 28 \
       -preset slow -an -movflags +faststart loop.mp4

# WebM fallback
ffmpeg -i "Sample Video - Yachatdac.mp4" -vf "scale=1600:-2" -c:v libvpx-vp9 -crf 40 \
       -b:v 0 -an loop.webm

# Poster frame
ffmpeg -i loop.mp4 -vframes 1 -q:v 3 poster.jpg
```

Serve as `muted playsinline loop preload="metadata"` with the poster set.

⚠ `ffmpeg` is **not installed** on this machine — it was probed during the 2026-08-31 audit
and is missing, along with ImageMagick. Install it, or do the transcode elsewhere.

## What this unblocks

`IMG-12` hover video and `AMB-06` video field are both listed as blocked-pending in
[`../../ASSETS.md`](../../ASSETS.md) §9 for exactly this reason. They are the only two
effects waiting on the video.

Nobody has reviewed this file's content, so nothing is recorded here about what it shows or
whether it carries anything culturally sensitive. **Watch it before using it.**
