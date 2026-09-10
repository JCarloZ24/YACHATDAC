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

✅ `ffmpeg` **is installed** as of 10 September 2026 — 9.0.1-full_build, via
`winget install Gyan.FFmpeg`. (ImageMagick is still missing.) The 2026-08-31 audit's note that
it was absent no longer holds.

## What the first real transcode taught us, 10 September 2026

The homepage loading film (`Main_V2_16.mp4`, a separate 104.2 MiB file, not the 162 MB master
above) went through this pipeline and produced R11's first measured targets — see
[`../../ASSETS.md`](../../ASSETS.md) §7. Two corrections to the recipe below:

- **Use two-pass, not CRF, when a budget is hard.** CRF 30 at 1280 came out at 6.77 MB and CRF
  32 at 1920 at 10.21 MB. CRF targets a *quality*, not a *size*, and on busy footage — foliage,
  drone motion, fire — it will overshoot a byte budget every time:

  ```bash
  ffmpeg -y -i in.mp4 -vf "scale=960:-2:flags=lanczos" -c:v libx264 -b:v 380k          -preset slow -profile:v high -pix_fmt yuv420p -an -pass 1 -f null NUL
  ffmpeg -y -i in.mp4 -vf "scale=960:-2:flags=lanczos" -c:v libx264 -b:v 380k          -preset slow -profile:v high -pix_fmt yuv420p -an -pass 2          -movflags +faststart out.mp4
  ```

- **"Roughly 1.2 MB" is a figure for a LOOP.** A 39-second film cannot reach it and stay
  watchable; 1.78 MB at 960 wide was the honest floor. `+faststart` is what makes that
  survivable — playback starts after a few hundred KB, so length costs bandwidth but not
  time-to-first-frame.

- **Drop the audio (`-an`) unless it is doing work.** It is weight, and on a muted autoplay
  background it is weight nobody can hear.

## What this unblocks

`IMG-12` hover video and `AMB-06` video field are both listed as blocked-pending in
[`../../ASSETS.md`](../../ASSETS.md) §9 for exactly this reason. They are the only two
effects waiting on the video.

Nobody has reviewed this file's content, so nothing is recorded here about what it shows or
whether it carries anything culturally sensitive. **Watch it before using it.**
