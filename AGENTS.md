# CLAUDE.md

AlphaCode technical blog — Jekyll + YAT theme (v1.10.0), Korean posts on AI/ML/software/tech trends.
Standard Jekyll layout (`_posts/`, `_layouts/`, `_includes/`, `_sass/yat/`, `_data/`, `assets/`); `bundle exec jekyll serve|build`.

- `_config.yml` `exclude:` lists CLAUDE.md so it is not copied to `_site`
- `_data/defaults.yml` (UI defaults/translations), `_data/translate_langs.yml` (Google Translate languages)
- Plugins: jekyll-feed, jekyll-seo-tag, jekyll-sitemap, jekyll-paginate, jekyll-spaceship
- Project docs in `docs/` (post processing, language detection, Sphere converter)

## Adding New Posts

`_posts/YYYY-MM-DD-title.md`, Korean content. Front matter:

```yaml
---
layout: post
title: "포스트 제목"
date: 2025-01-30 12:00:00 +0900
author: 작성자
categories: [카테고리]
tags: [태그1, 태그2]
excerpt: "요약내용"
banner_image: "/assets/images/alphacode/alphacode.jpeg"
---
```

Images go in `assets/images/` (by post or purpose); default banner `/assets/images/alphacode/alphacode.jpeg`.

## Sphere (.sp) → Markdown (`gen_md`)

Drafts authored in the Sphere editor live in `content/Blog/[topic]/*.sp`. Convert with:

```bash
cd gen_md && node program.js -i "../content/Blog/[folder]/[file].sp" -o "../_posts/YYYY-MM-DD-post-title.md"
```

- **IMPORTANT**: always use the current date in the output filename
- Needs `OPENAI_API_KEY` in `gen_md/.env` (template `.env.example`) and `npm install` in `gen_md`
- Generates front matter, processes images, extracts tags, and prints a suggested social media message
- Review the generated post in `_posts/`, then commit and push to publish

## Export tools (`gen_md/`)

- `python combine_posts.py` → `gen_md/all_posts_combined.md` (all posts by date, front matter stripped, date/title headers)
- `python convert_to_docx.py` → `all_posts_combined.docx` (run after combine; keeps headings/emphasis, monospace code, page break per post)
