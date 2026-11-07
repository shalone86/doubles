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

## Run your own copy

This is open source (MIT). You don't need to code to use it, just visit [angelio.org/doubles/](https://angelio.org/doubles/).
If you do code and want your own copy, or want to change it for your class:

```bash
git clone https://github.com/shalone86/doubles.git && cd doubles
npm install
npm test
python3 -m http.server -d public 8787     # open http://localhost:8787 (uses the device's voice)
npx wrangler deploy                       # optional: your own Cloudflare Worker with the nicer voice
```

Before deploying your own copy, change `"name"` in `wrangler.jsonc` and remove the `routes` and
`vars` lines (those belong to angelio.org). Building a new app? Start from
[shalone86/app-template](https://github.com/shalone86/app-template). Fixes and question corrections
are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md).

The code is MIT licensed ([LICENSE](LICENSE)). The name "Angelio" and its logo are not part of the license.
