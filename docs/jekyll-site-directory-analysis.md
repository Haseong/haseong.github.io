# Jekyll _site 디렉토리 분석

## 개요

`_site` 디렉토리는 Jekyll의 빌드 출력 디렉토리로, `bundle exec jekyll build` 또는 `bundle exec jekyll serve` 실행 후 생성된 모든 정적 파일이 저장되는 곳입니다. 이 디렉토리에는 웹 서버에 배포할 준비가 된 완전한 정적 웹사이트가 포함되어 있습니다.

## _site에 생성되는 파일들

### 1. **변환된 파일들**
Jekyll에 의해 처리되고 변환되는 파일들:

- **마크다운 포스트** (`_posts/*.md`) → 날짜별로 정리된 HTML 파일
  - 예시: `_posts/2025-02-10-tech-Chain-of-Thought.md` → `_site/tech/2025/02/10/tech-Chain-of-Thought.html`
  
- **SCSS 파일** (`assets/css/main.scss`) → 컴파일된 CSS
  - `assets/css/main.scss` → `_site/assets/css/main.css` (소스맵 포함)
  
- **레이아웃 템플릿** → 콘텐츠 페이지에 적용
  - `_layouts/`의 레이아웃이 콘텐츠와 병합되어 최종 HTML 페이지 생성
  
- **Liquid 템플릿** → 처리되고 렌더링됨
  - 모든 Liquid 태그와 변수가 실제 값으로 대체됨

### 2. **복사되는 파일들**
변환 없이 그대로 복사되는 파일들:

- **정적 에셋**
  - 이미지: `assets/images/`의 모든 파일이 직접 복사됨
  - JavaScript: `assets/js/main.js`가 수정 없이 복사됨
  
- **루트 레벨 파일**
  - `CLAUDE.md` - 문서 파일
  - `README.md` - 저장소 문서
  - `LICENSE.txt` - 라이선스 정보
  - `jekyll-theme-yat.gemspec` - 테마 명세
  - `robots.txt` - SEO 지시사항
  
- **HTML 페이지**
  - `404.html` - 오류 페이지
  - `about.html` - 소개 페이지
  - `archives.html` - 아카이브 목록
  - `categories.html` - 카테고리 목록
  - `tags.html` - 태그 목록
  - `index.html` - 홈페이지

### 3. **생성되는 파일들**
Jekyll과 플러그인에 의해 생성되는 파일들:

- `feed.xml` - RSS/Atom 피드 (jekyll-feed 플러그인 생성)
- `sitemap.xml` - XML 사이트맵 (jekyll-sitemap 플러그인 생성)
- SEO 메타 태그가 포함된 각 포스트의 HTML 파일 (jekyll-seo-tag 플러그인)

## 디렉토리 구조 매핑

```
소스 디렉토리              →  _site 디렉토리
================             ================
_posts/YYYY-MM-DD-*.md   →  /category/YYYY/MM/DD/*.html
_layouts/                →  (HTML 페이지에 병합됨)
_includes/               →  (HTML 페이지에 병합됨)
_sass/                   →  /assets/css/main.css
assets/                  →  /assets/ (그대로 복사)
*.html (루트)            →  /*.html (처리됨)
*.md (루트)              →  /*.md (그대로 복사)
```

## 파일 처리 규칙

### 처리되는 파일들:
1. **Front Matter가 있는 파일** (`---` 마커 사이의 YAML)
   - 마크다운 파일은 HTML로 변환됨
   - HTML 파일은 Liquid 템플릿이 처리됨
   
2. **SCSS/Sass 파일**
   - CSS로 컴파일되며 선택적으로 소스맵 포함

### 복사되는 파일들:
1. Front Matter가 없는 **정적 에셋**
2. **문서 파일** (CLAUDE.md 같은)
3. 제외되지 않은 **설정 파일**

## CLAUDE.md가 _site에 있는 이유

CLAUDE.md가 `_site` 디렉토리에 나타나는 이유:

1. **Front Matter 없음**: 파일에 Jekyll front matter(`---` 마커 사이의 YAML)가 없어서 Jekyll이 정적 파일로 처리함
2. **제외되지 않음**: `_config.yml`의 `exclude:` 설정에 포함되지 않음
3. **기본 동작**: Jekyll은 프로젝트 구조를 유지하기 위해 처리되지 않은 모든 파일을 복사함

이는 배포된 사이트에서 문서에 접근할 수 있게 해주므로 실제로 유용할 수 있지만, 일반적으로 프로덕션에서는 이러한 파일을 제외시키는 것이 좋습니다.

## _site에서 파일 제외하기

파일이 `_site`로 복사되는 것을 방지하려면 `_config.yml`에 추가하세요:

```yaml
exclude:
  - CLAUDE.md
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor
  - .git
```

## 성능 고려사항

`_site` 디렉토리가 커질 수 있는 이유:
- 고해상도 이미지 (블로그에 많은 이미지 에셋이 있음)
- 다른 형식의 중복 콘텐츠
- 과거 빌드 아티팩트

모범 사례:
1. `.gitignore`에 `_site/` 추가 (이미 완료됨)
2. `bundle exec jekyll clean`으로 주기적으로 빌드 정리
3. `assets/`에 추가하기 전에 이미지 최적화

## 배포

`_site/`의 내용이 웹 서버에 배포되는 것입니다. 이 디렉토리에는 정적 웹사이트를 실행하는 데 필요한 모든 것이 포함되어 있어, 프로덕션 서버에는 Ruby, Jekyll 또는 기타 의존성이 필요하지 않습니다.