<div align="center">
  <br>

  <a href="https://alphacode.ai">
    <img alt="AlphaCode Logo" src="https://alphacode.ai/images/logo/logo.png" width="350">
  </a>

  <h1>AlphaCode Tech Blog</h1>

</div>

<br>

## 소개

AlphaCode 기술 블로그는 Jekyll과 YAT 테마(v1.10.0)를 기반으로 구축된 정적 사이트입니다. AI, 머신러닝, 소프트웨어 개발, 기술 트렌드에 대한 한국어 콘텐츠를 제공합니다.

## 문서

- [Jekyll 포스트 처리 과정](docs/jekyll-post-processing.md) - Jekyll이 마크다운 파일을 HTML로 변환하는 과정 설명
- [Sphere to Markdown 변환기](docs/sphere-to-markdown-converter.md) - Sphere JSON 파일을 Jekyll 포스트로 변환하는 도구

## 주요 기능

- 아름다운 **다크 모드** 지원
- 모던 반응형 웹 디자인
- 다양한 레이아웃: `home`, `post`, `tags`, `archive`, `about`
- Font Awesome 5 아이콘 사용
- 이미지와 비디오를 활용한 페이지 배너
- [highlight.js][highlight-js]를 사용한 코드 문법 강조
- [Jekyll Feed][jekyll-feed]를 통한 RSS 지원
- [Jekyll Seo Tag][jekyll-seo-tag]를 통한 검색 엔진 최적화
- [Jekyll Sitemap][jekyll-sitemap]을 통한 사이트맵 지원
- [Jekyll Spaceship][jekyll-spaceship]을 통한 고급 기능:
  - 복잡한 테이블 지원
  - MathJAX 및 LaTeX 지원
  - 미디어(YouTube, Spotify 등) 임베드
  - 다이어그램(PlantUML, Mermaid) 지원
- Google 번역 지원
- 신규 포스트 태그 표시
- **Google AdSense 통합** (사이드바 및 포스트 하단)
- **무한 스크롤 기능** (페이지네이션 자동 로드)
- **SEO 최적화** (Open Graph, JSON-LD 구조화 데이터)

## 설치

Mac에서 Ruby와 Jekyll 설치하기:

[Jekyll 설치 가이드](https://jekyllrb.com/docs/installation/macos/)

### 필수 요구사항

- Ruby 3.0 이상
- RubyGems
- GCC 및 Make
- xz 유틸리티 (nokogiri 빌드용): `brew install xz`

의존성 설치:

```bash
$ bundle install
```

**참고**: Ruby 3.4+ 사용 시 Gemfile에 `csv`와 `base64` gem이 필요합니다.

## 개발

### 로컬 개발 서버 실행

```bash
$ bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`으로 접속하여 확인할 수 있습니다. 
파일을 수정하면 자동으로 사이트가 재생성되며, 브라우저를 새로고침하면 변경사항을 확인할 수 있습니다.

### 프로덕션 빌드

```bash
$ bundle exec jekyll build
```

빌드된 파일은 `_site` 디렉토리에 생성됩니다.

### 빌드 정리

```bash
$ bundle exec jekyll clean
```

## 포스트 작성

1. `_posts` 디렉토리에 `YYYY-MM-DD-제목.md` 형식으로 파일 생성
2. Front matter 작성:
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
3. 마크다운으로 내용 작성

### Sphere 파일에서 포스트 생성

Sphere 편집기로 작성한 `.sp` 파일을 Jekyll 포스트로 변환:

```bash
# gen_md 디렉토리에서 실행
cd gen_md && node program.js -i "../content/Blog/[폴더]/[파일].sp" -o "../_posts/YYYY-MM-DD-post-title.md"
```

**참고**: gen_md 도구는 OpenAI API 키가 필요합니다. `gen_md/.env` 파일에 설정하세요.

## 디렉토리 구조

```
.
├── _config.yml      # Jekyll 설정 파일
├── _posts/          # 블로그 포스트
├── _layouts/        # 레이아웃 템플릿
├── _includes/       # 재사용 가능한 컴포넌트
├── _sass/           # SCSS 스타일시트
├── _data/           # 데이터 파일
├── _plugins/        # Jekyll 플러그인 (GitHub Pages에서는 지원 안 함)
├── assets/          # 정적 파일 (이미지, CSS, JS)
├── content/         # Sphere 편집기 콘텐츠 (.sp 파일)
├── gen_md/          # Sphere to Markdown 변환 도구
├── docs/            # 프로젝트 문서
└── _site/           # 빌드 출력 (gitignore됨)
```

## GitHub Pages 배포

이 블로그는 GitHub Pages에 최적화되어 있습니다. 

### 주의사항

- GitHub Pages는 사용자 정의 플러그인(`_plugins/`)을 지원하지 않습니다
- `jekyll-paginate-v2`는 지원되지 않으므로 기본 `jekyll-paginate`를 사용합니다
- AdSense는 production 환경에서만 표시됩니다

### 배포 방법

```bash
git add .
git commit -m "Update blog"
git push origin main
```

## 문제 해결

### Ruby 3.4+ 버전 오류
Ruby 3.4 이상 사용 시 다음 gem들을 Gemfile에 추가해야 합니다:
- `gem "csv"`
- `gem "base64"`

### 페이지네이션 404 오류
GitHub Pages에서 `/page2/index-posts.html` 404 오류 발생 시:
- `_plugins/minimal_pagination.rb` 비활성화
- `jekyll-paginate-v2` 제거
- 기본 `jekyll-paginate` 사용

## 라이선스

이 테마는 [MIT 라이선스](https://opensource.org/licenses/mit-license.php)를 따릅니다. © JeffreyTse.

<!-- External links -->

[jekyll]: https://jekyllrb.com/
[yat-live-demo]: https://jeffreytse.github.io/jekyll-theme-yat/
[jekyll-spaceship]: https://github.com/jeffreytse/jekyll-spaceship
[jekyll-seo-tag]: https://github.com/jekyll/jekyll-seo-tag
[jekyll-sitemap]: https://github.com/jekyll/jekyll-sitemap
[jekyll-feed]: https://github.com/jekyll/jekyll-feed
[highlight-js]: https://github.com/highlightjs/highlight.js