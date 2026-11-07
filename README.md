# Doubles!

Live at **https://angelio.org/doubles/** (part of the Angelio learning apps hub, shalone86/angelio).
The old address doubles.shalonely.com redirects there, carrying saved progress.

Built from the learning-app template (`public/js/kit/`): read-aloud with Cloudflare Aura-2 or the
device voice, sounds, stars and stickers, offline support, and a Cloudflare Worker (`worker/`).

```bash
npm install
npm test                                  # worker tests
python3 -m http.server -d public 8787     # or: npx wrangler dev
npx wrangler deploy
```

This repo is now the source of truth. It was rebuilt on 2026-11-07 from what was deployed (the
first commit is that snapshot), then fixed. Please make changes here, not in older local copies,
so the fixes aren't overwritten.
