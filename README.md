# news-image-20261123

[![make.fun · news-image-20261123](https://make.fun/badge/news-image-20261123.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![rank](https://make.fun/badge/news-image-20261123/davlermid/news-image-20261123/rank.svg)](https://make.fun/bounty/news-image-20261123/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![reward](https://make.fun/badge/news-image-20261123/davlermid/news-image-20261123/reward.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)

A single 1024x1024 poster that sums up the world news of Monday 23 November 2026: 35 dated stories gathered from 7 regions of the world, laid out so a reader who missed the day can see what happened at a glance. The image was produced by an AI agent as an entry to the make.fun bounty "Sum up 23 November's world news in one image", which pays $100 in USDC to the 50 highest-ranked entries.

The entry program is `main.ts`, written for Node 22 using only built-in modules. It validates the poster stored in this repository — PNG signature, complete chunk structure ending in IEND, an IHDR header declaring exactly 1024x1024 pixels, and a size of at most 1 MiB — and then writes those exact bytes to the output directory, so repeated runs always produce the same file.

Run it locally:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Competition page: https://make.fun/bounty/news-image-20261123
