# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the AlphaCode technical blog built with Jekyll and the YAT theme (v1.10.0). The blog publishes content in Korean about AI, machine learning, software development, and technology trends.

## Essential Commands

### Development

```bash
# Install dependencies
bundle install

# Run local development server
bundle exec jekyll serve

# Build the site
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean
```

### Testing and Validation

```bash
# Check Jekyll configuration
bundle exec jekyll doctor

# Build with verbose output for debugging
bundle exec jekyll build --verbose

# Serve with live reload disabled (for testing production behavior)
bundle exec jekyll serve --no-watch
```

## Architecture and Structure

### Directory Structure

```
.
├── _config.yml      # Jekyll configuration (with CLAUDE.md excluded)
├── _posts/          # Blog posts (YYYY-MM-DD-title.md format)
├── _layouts/        # Layout templates
├── _includes/       # Reusable components
├── _sass/           # SCSS stylesheets
├── _data/           # Data files (defaults, translations)
├── assets/          # Static files
│   ├── images/      # Image assets (img/ directory removed)
│   ├── css/         # Main SCSS entry point
│   └── js/          # JavaScript files
├── docs/            # Project documentation
└── _site/           # Build output (gitignored)
```

### Jekyll Convention

This blog follows standard Jekyll conventions:

- Posts in `_posts/` with naming format: `YYYY-MM-DD-title.md`
- Layouts in `_layouts/` define page structures
- Includes in `_includes/` contain reusable components
- SCSS styles in `_sass/` following the YAT theme structure

### Theme Architecture

The YAT theme provides:

- Multi-layout support (home, post, archive, tags, categories)
- Night mode with persistent user preference
- Responsive design with mobile-first approach
- Advanced Markdown features via jekyll-spaceship plugin

### Content Processing Flow

1. Markdown posts → Kramdown processor → HTML output
2. SCSS → Compiled to CSS → Minified for production
3. Includes → Liquid templating → Final HTML pages
4. Plugin processing (SEO, feed, sitemap) → Enhanced output
5. All output → `_site/` directory

### Key Configuration Points

- `_config.yml`: Main site configuration including theme settings, plugin options, and site metadata
  - `exclude:` list now includes CLAUDE.md to prevent copying to _site
- `_data/defaults.yml`: Default values for translations and UI elements
- `_data/translate_langs.yml`: Language configuration for Google Translate integration

### Plugin Architecture

- **jekyll-feed**: Generates RSS/Atom feeds
- **jekyll-seo-tag**: Adds meta tags for SEO
- **jekyll-sitemap**: Creates sitemap.xml
- **jekyll-paginate**: Provides pagination functionality
- **jekyll-spaceship**: Extends Markdown with tables, math, media embeds, and diagrams

## Development Guidelines

### Adding New Posts

1. Create file in `_posts/` with format: `YYYY-MM-DD-title.md`
2. Include front matter with title, categories, tags, and banner_image
3. Use Korean language for content consistency
4. Leverage jekyll-spaceship features for rich content

Example front matter:
```yaml
---
layout: post
title: "포스트 제목"
date: 2025-01-30 12:00:00 +0900
author: 작성자
categories: [카테고리]
tags: [태그1, 태그2]
banner_image: "/assets/images/alphacode/alphacode.jpeg"
---
```

### Modifying Theme Components

- Theme files are in `_layouts/`, `_includes/`, and `_sass/`
- Follow existing SCSS structure in `_sass/yat/`
- JavaScript functionality in `assets/js/`

### Working with Images

- Store in `assets/images/` organized by post or purpose
- Banner images default to `/assets/images/alphacode/alphacode.jpeg`
- Optimize images for web performance
- Note: `assets/img/` directory has been removed (92MB of unused files)

### Common Tasks

- Update site configuration: Edit `_config.yml`
- Modify theme colors/styles: Edit files in `_sass/yat/`
- Add new page layouts: Create in `_layouts/`
- Customize components: Edit files in `_includes/`

## Recent Changes

- Removed unused `assets/img/` directory (468 files, 92MB)
- Added `exclude:` configuration to prevent CLAUDE.md from being copied to _site
- Created documentation in `docs/` directory
- Updated README.md to Korean with proper documentation links