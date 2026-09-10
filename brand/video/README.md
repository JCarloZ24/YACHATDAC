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

---

## Homepage loading film — re-encode, 11 September 2026

August: *"fix the video quality just like what we did on Wonder"*, and the film needs sound.
`Main_V2_16.mp4` went back through the pipeline; the served set is now three tiers **with
audio**, replacing the two silent ones from 10 September. Numbers and the "why" live in
[`../../ASSETS.md`](../../ASSETS.md) §7 — the commands live here.

The master's delivery mix has the same fault as Wonder's and worse: **−10.50 LUFS, true peak
+0.44 dBFS**, i.e. already clipping, and 6.5 LU hotter than the mix that startled people.
Measure first, then normalise with the measured values and `linear=true` so the range is
preserved rather than pumped:

```bash
# 1 · measure
ffmpeg -i Main_V2_16.mp4 -af loudnorm=I=-23:TP=-2:LRA=11:print_format=json -f null -

# 2 · two-pass picture, normalised audio, per tier (960/800k, 1440/2300k, 1920/3300k)
LN="loudnorm=I=-23:TP=-2:LRA=11:measured_I=-10.50:measured_TP=0.44:measured_LRA=8.90:measured_thresh=-21.41:offset=-0.70:linear=true"
ffmpeg -y -i Main_V2_16.mp4 -vf "scale=1440:-2:flags=lanczos" -c:v libx264 -b:v 2300k   -preset slow -profile:v high -pix_fmt yuv420p -an -pass 1 -passlogfile p1440 -f null -
ffmpeg -y -i Main_V2_16.mp4 -vf "scale=1440:-2:flags=lanczos" -c:v libx264 -b:v 2300k   -preset slow -profile:v high -pix_fmt yuv420p -pass 2 -passlogfile p1440   -af "$LN" -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart home-loader-1440.mp4
```

Verified back at **−23.05 LUFS / −11.64 dBFS peak, LRA 8.90 unchanged**. 128 kbps stereo here,
against Wonder's 64 kbps mono, because this bed is music rather than outdoor ambience.

⚠ **Anyone recutting this film has to re-run step 1 against the new master.** The measured
values above are baked into step 2; reusing them on different audio silently mis-normalises it,
and the clipping comes straight back.

⚠ This supersedes the 10 September note below that says *"drop the audio (`-an`) unless it is
doing work"*. That was correct for a muted autoplay background. The film now carries a sound
control, so the audio is doing work.

---

## Wonder hero — audio spec, 10 September 2026

`public/media/wonder/wonder-hero-*.mp4` are the **six** served encodes of the hero film
(60.04s, 1501 frames) — three landscape widths, and from 11 September 2026 three portrait
cuts as well. Every one of them is **loudness-normalised, and a replacement must be too** —
the delivered mix startled visitors who turned the sound on. The portrait reframes arrived
carrying that same unnormalised mix, which is why this section applies to them unchanged.

**The master is `1MIN EDIT NO SUPERS.mov`** — 2.36 GB ProRes 10-bit with PCM s16le stereo,
in the user's Downloads, deliberately not in the repo. It is **not** normalised and must not
be: masters are not overwritten. Its audio measures −17.07 LUFS, true peak −0.14 dBFS,
LRA 6.8 — level with the ceiling but not over it. The clipping in the old served files
(+0.6 dBFS) was introduced by the H.264/AAC transcode, not by the mix.

**Take the audio from the master, not from a served file.** The first pass at this
normalised the existing MP4s, which put the audio through AAC twice for no reason. The
served encodes now carry video stream-copied from the H.264 tier and audio encoded once from
the master's PCM.

**No EQ, and none is wanted.** Measured per band on the master (RMS): 60 Hz −42.1,
100 Hz −30.5, 250 Hz −24.9, 1 kHz −25.6, 4 kHz −34.8, 10 kHz+ −46.8 dB. That is an ordinary
outdoor ambience curve — no sub rumble to cut, no low-mid honk, no sibilance spike. The
startle was level, not tone, and tone is the edit's own decision.

| | As delivered | Served now |
| --- | --- | --- |
| Integrated | −17.0 LUFS | **−23.0 LUFS** |
| True peak | **+0.6 dBFS — clipping** | −5.3 dBFS |
| Range (LRA) | 6.7 LU | 6.7 LU — unchanged |
| Audio codec | AAC 82 kbps stereo | AAC 64 kbps stereo, 48 kHz |
| Lossy generations | 1 | 1 — re-derived from the master's PCM |

Two passes, because single-pass `loudnorm` is dynamic and pumps an ambient bed. Measure
first, then apply the measurements with `linear=true`, and **stream copy the picture** — the
video was never the problem and re-encoding it would cost quality for nothing:

```bash
# 1 — measure THE MASTER's audio
ffmpeg -i "1MIN EDIT NO SUPERS.mov" -map 0:a:0   -af loudnorm=I=-23:TP=-2:LRA=7:print_format=json -f null -

# 2 — video from the encoded tier, audio from the master, with those numbers
ffmpeg -i tier.mp4 -i "1MIN EDIT NO SUPERS.mov" -map 0:v:0 -map 1:a:0 -c:v copy   -af "loudnorm=I=-23:TP=-2:LRA=7:measured_I=-17.07:measured_TP=-0.14:measured_LRA=6.80:measured_thresh=-27.22:offset=0.00:linear=true"   -c:a aac -b:a 64k -ar 48000 -shortest -movflags +faststart out.mp4
```

The player caps playback at `SOUND_MAX` (0.8) and fades **in over 220ms, out over 600ms** —
see the notes at the top of `src/app/wonder/_components/HeroVideo.tsx`. That ceiling assumes
a file at this loudness; it is not a substitute for normalising one.

### The opening is the quietest passage, and the fade must not sit on it

The film opens on a guitar scale. Measured per half second on the served encode:

| | Peak | RMS |
| --- | --- | --- |
| 0–2.5s (the scale) | −16 to −17 dBFS | −25 to −30 dB |
| 3–4s | −17 to −23 dBFS | −30 to −34 dB |
| 8–30s (the body) | −9 to −12 dBFS | −23 to −26 dB |
| last 0.5s | −38 dBFS | −51 dB |

So the opening sits 6–7 dB below the body and there is **no peak to fade against** there. A
long fade-in only buries the one deliberate musical moment; 220ms is a click guard and
nothing more. The edit also fades itself out to near silence, so **the loop point needs no
re-fade either** — the player used to force silence and ramp back on every wrap, which cost
the first fifth of a second of the scale each time round, and no longer does.

⚠ **If a re-cut ends hard rather than decaying, say so** — that is a note for the editor, or
failing that a reason to restore the wrap fade, not something the player should assume.

*Last updated: 11 September 2026*

---

## The portrait re-cut — DELIVERED 11 September 2026

**The brief below was answered.** Two reframes arrived in Downloads:

| File | | Served as |
| --- | --- | --- |
| `Mobile_9x16_1080x1920.mp4` | 1080 × 1920, 9:16, 60.04s, 25 fps, 167 MB | `wonder-hero-portrait-1440.mp4` (810 × 1440, 8.43 MB) and `-portrait-1152.mp4` (648 × 1152, 5.55 MB) |
| `Tablet_Vertical_3x4_1536x2048.mp4` | 1536 × 2048, 3:4, 60.04s, 25 fps, 171 MB | `wonder-hero-wide-1536.mp4` (1152 × 1536, 11.32 MB) |

**The tablet cut was not asked for and is the more useful of the two.** The brief conceded
that 9:16 leaves an iPad Air at 81% of its height, the worst case in the table below; a 3:4
source holds 93% of its width there. `pickTier` now chooses on that geometry alone — there is
no device list anywhere in the player.

**What was checked before they were used.**

- **The two framings the brief named are right.** Frames pulled at 0:00, 0:02, 0:20, 0:45 and
  0:58: Suzanne's head is whole at 0:20 and the guests are not sliced at 0:45 — the two
  failures of the blind centre crop in `reference/`. Faces sit in the 10–72% compose band.
  Her hat crown rides into the top 0–10% nav zone, which is brim, not face, and is fine.
- **No supers, no letterbox or pillarbox**, as asked.
- **Same cut, not a re-edit.** Both are 1501 frames at 25 fps and 60.04s, and both carry audio
  measuring −17.07 LUFS / −0.14 dBFS / LRA 6.80 — identical to the master. So the landscape
  timings, `supersEnd: 0` and the loop-point findings below all still hold.
- **It does not end hard.** The decay is as before, so the player's wrap needs no re-fade.

**Delivered as H.264, not the ProRes the brief asked for** — 22 Mb/s MP4, so the picture in
these three files is one lossy generation further from the master than the landscape tiers
are. At 22 Mb/s that is not visible once downscaled to 810 or 1152 wide, and it was not worth
holding the fix over. **Audio is unaffected: it is still taken from the master's PCM**, so it
remains one generation, exactly as the spec above requires.

*If a re-cut is ever commissioned, ask for ProRes again* — the request stands, it simply was
not worth blocking on.

### How these three were encoded

Two-pass, per the 10 September lesson that CRF overshoots a byte budget on foliage and drone
motion. Picture only; audio is muxed in afterwards from the master with the measured
`loudnorm` numbers already recorded above.

```bash
# 1 — picture, two-pass, no audio. Widths: 810:1440 @1100k, 648:1152 @700k, 1152:1536 @1500k
ffmpeg -y -i Mobile_9x16_1080x1920.mp4 -vf "scale=810:1440:flags=lanczos"   -c:v libx264 -b:v 1100k -preset slow -profile:v high -pix_fmt yuv420p -an   -pass 1 -passlogfile pl -f null /dev/null
ffmpeg -y -i Mobile_9x16_1080x1920.mp4 -vf "scale=810:1440:flags=lanczos"   -c:v libx264 -b:v 1100k -preset slow -profile:v high -pix_fmt yuv420p -an   -pass 2 -passlogfile pl -movflags +faststart v-portrait-1440.mp4

# 2 — audio once, from the master's PCM (see the audio spec above for the numbers)
```

All three verify at **−23.01 LUFS, −5.77 dBFS true peak, LRA 6.80 unchanged**, 1501 frames.

### What the phone actually gets now

| | Before | Now |
| --- | --- | --- |
| Served to a 390 × 844 phone | `wonder-hero-960.mp4`, 16:9 | `wonder-hero-portrait-1440.mp4`, 9:16 |
| Of the frame on screen | **27%** | **82%** |
| Magnification under cover | **3.7× upscale** | **none** — 810 covers the ~950px asked at DPR 2 |
| Weight | 5.88 MB | 8.43 MB, or 5.55 MB on a saver link |

2.55 MB more for a picture that is sharp rather than soft. R11's above-the-fold budget is
2.5 MB and this film has exceeded it since it shipped; the portrait tier does not fix that
and does not pretend to. What it fixes is that the bytes now land on screen instead of being
cropped away.

---

## The brief as it was raised (10 September 2026) — kept for the record


**Why.** Full-bleed in a portrait phone, `object-cover` magnifies the 16:9 edit **3.7×** and
shows only the **middle 27%** of the frame. 73% of every byte is discarded, the picture is
soft, and no landscape encode fixes it: 1440 × 810 costs 14.9 MB at CRF 30 and is still soft.
August's call (10 Sep 2026) is a cut framed for the shape.

**Why we did not crop it ourselves.** A blind 9:16 centre crop is wrong, and the evidence is
in `reference/`:

| File | What it shows |
| --- | --- |
| `reference/wonder-hero-source-frames.jpg` | frames at 0:02, 0:20, 0:45 as delivered |
| `reference/wonder-hero-blind-916-centre-crop.jpg` | the same three centre-cropped — **Suzanne's head is cut in half at 0:20 and the guests are sliced at 0:45** |

Framing people is the editor's judgement, and this film is people.

### What to deliver

| | |
| --- | --- |
| Aspect | **9:16**, and see "no aspect fits every phone" below — deliver 9:16 **plus the safe area** |
| Resolution | **1080 × 1920**. We downscale to 810 × 1440 for the web tier |
| Container / codec | **ProRes 422 HQ `.mov`, PCM audio** — a mezzanine, never a web-compressed file. We do the web encode. |
| Frame rate | 25 fps, as the master |
| Colour | Rec.709, graded as delivered. Square pixels, progressive |
| Framing | **no letterbox or pillarbox** — fill the 9:16 frame; we crop, black bars would be baked in |
| Supers | none, as with `1MIN EDIT NO SUPERS` — nothing may sit under the H1 |
| Duration | 60s matches the landscape cut. **A shorter loop is welcome** — the weight is linear, so 20s is a third of the bytes |
| Audio | leave it; we normalise (see above). Say so if the cut ends hard rather than decaying |

### No aspect fits every phone — deliver 9:16 and frame to a safe area

9:16 is **not** sufficient on its own. It is the right thing to cut in, because it is what
editors work in and it is the least-bad fit across the range, but modern phones are taller
than 9:16 (about 19.5:9) and portrait tablets are wider, so `object-cover` always crops
something. Measured against the real CSS viewports:

| Device | CSS viewport | Of a 9:16 frame, visible |
| --- | --- | --- |
| iPhone SE 2/3 | 375 × 667 | 100% — the one exact fit |
| iPhone 12–16 | 390 × 844 → 430 × 932 | **82% of the width** (9% off each side) |
| Galaxy S22–S24 | 360 × 780 → 384 × 824 | 82–83% of the width |
| Pixel 7/8 | 412 × 915 | **80% of the width** — the worst phone case |
| iPad mini portrait | 744 × 1133 | 86% of the height |
| iPad Air portrait | 820 × 1180 | **81% of the height** — the worst tablet case |

**So the safe area is the central 80% × 81%.** Anything essential — a face, a hand, the
subject of the shot — must sit inside it, and the outer tenth is free to be lost.

Two more keep-clear zones, measured on the built page at 390 × 844, as percentages of frame
height. These are ON TOP of the safe area:

| Zone | Where | What sits there |
| --- | --- | --- |
| Top | 0–10% | the site nav |
| Bottom | 72–100% | the H1 "Guesting On-Country" (73–89%) and the sound button (92–96%) |

Which leaves **roughly 10%–72% of frame height as the band to compose in.** Faces belong
there. A 35% black scrim also sits over the whole film, so contrast is our problem, not the
edit's.

*Rejected alternatives, for the record.* **9:19.5** (1080 × 2340) fits modern phones almost
exactly, but drops iPhone SE to 82% of height and iPad Air to 66% — it trades a small win on
new phones for a large loss elsewhere. **4:5** keeps only 58% of the width on a 390 × 844
phone; it beats the 16:9 we have today but is well behind 9:16.

### What we serve, and why

**H.264 High in MP4 with `+faststart` is the baseline and is not optional** — it is the one
thing every browser plays. Measured on a 10s portrait sample, extrapolated to 60s:

| Codec | Setting | 60s at 810 × 1440 |
| --- | --- | --- |
| H.264 | CRF 23 | 24.8 MB |
| H.264 | CRF 28 | 12.0 MB |
| **H.265 / HEVC** | CRF 28 | **13.5 MB** — roughly H.264 CRF 23's quality for ~45% fewer bytes |
| AV1 (SVT, preset 6) | CRF 32 | 17.2 MB — needs a slower preset to show its real advantage |

Not quality-matched, so treat these as indicative. The standing decision in
`src/content/wonder-media.ts` is **MP4 only** — a second codec set doubles the repo's video
weight for a marginal win. That reasoning holds for the landscape tiers and is worth
revisiting for the **portrait tier alone**, where the saving is not marginal and the audience
is on mobile data: HEVC covers iOS and Safari natively, which is most phone traffic, with the
H.264 file as the fallback. `HeroVideo` sets `video.src` directly rather than using `<source>`
elements, so that would need a `canPlayType` check — not yet built.

*Last updated: 11 September 2026*
