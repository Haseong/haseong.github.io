# Jekyll 포스트 처리 과정

이 문서는 Jekyll이 `_posts` 폴더의 마크다운 파일을 어떻게 자동으로 블로그 글로 변환하는지 설명합니다.

## 개요

Jekyll은 정적 사이트 생성기로, `_posts` 폴더에 마크다운 파일을 추가하면 자동으로 HTML 블로그 포스트로 변환합니다. 이 과정은 여러 단계를 거쳐 진행됩니다.

## 1. 파일 발견 단계

Jekyll은 빌드 프로세스 중에 `_posts` 디렉토리를 자동으로 스캔합니다:

- **파일명 규칙**: `YYYY-MM-DD-제목.md` 형식을 따라야 함
  - 예: `2025-06-28-2204f32e7b6080eeb86ce2966641a2fc.md`
- **날짜 파싱**: 파일명의 날짜 부분이 자동으로 파싱되어 포스트 날짜로 사용됨
- **자동 수집**: 규칙에 맞는 모든 파일이 자동으로 포스트 컬렉션에 추가됨

## 2. Front Matter 처리

각 포스트 파일의 상단에는 YAML Front Matter가 포함되어야 합니다:

```yaml
---
layout: post
title: "마크다운의 부상: LLM 시대가 요구하는 문서 포맷"
date: 2025-06-28 07:08:00 +0000
author: 정하성
categories: [Column]
tags: [markdown, document-management, ai-integration]
banner_image: "/assets/images/alphacode/alphacode.jpeg"
---
```

Jekyll은 이 메타데이터를 추출하여:
- 사용할 레이아웃 템플릿 결정
- 포스트 변수 설정 (제목, 날짜, 저자, 카테고리, 태그)
- 포스트별 설정 구성

## 3. Markdown에서 HTML로 변환

변환 과정은 다음 단계를 거칩니다:

### 3.1 Kramdown 프로세싱
- Jekyll은 `_config.yml`에 설정된 Kramdown을 사용하여 Markdown을 HTML로 변환
- GitHub Flavored Markdown을 기본으로 지원
- 코드 블록, 테이블, 기타 확장 마크다운 기능 처리

### 3.2 Liquid 템플릿 처리
- 컨텐츠 내의 Liquid 템플릿 태그 처리
- `{{ post.title }}` 같은 변수를 실제 값으로 치환
- includes와 기타 동적 컨텐츠 처리

### 3.3 플러그인 향상
`jekyll-spaceship` 플러그인이 마크다운 기능을 확장:
- 향상된 테이블 지원
- 수학 표현식 렌더링
- 미디어 임베드
- 다이어그램 지원

## 4. 레이아웃 적용

포스트 컨텐츠는 여러 레이아웃 템플릿을 거쳐 처리됩니다:

### 4.1 post.html 레이아웃
- 포스트 고유의 구조를 감싸는 역할
- 이전/다음 포스트 네비게이션 추가
- 관련 포스트 섹션 포함
- 댓글 시스템 통합

### 4.2 framework.html 레이아웃
- 메인 페이지 구조 제공
- 사이드바 요소 추가
- 2열 레이아웃 생성

### 4.3 default.html 레이아웃
- HTML 문서 구조 제공
- 헤더, 푸터, 네비게이션 포함
- 테마 토글, 맨 위로 버튼 등 사이트 전체 기능 추가

## 5. 포스트 목록 생성

홈페이지와 아카이브 페이지를 위한 목록 생성:

### 5.1 페이지네이션 시스템
`_includes/views/pagination.html`이 처리:
- `paginator.posts` 또는 `site.posts` 순회
- 포스트 메타데이터와 발췌문 추출
- 읽기 시간 계산
- 3일 이내 포스트에 "NEW" 배지 표시

### 5.2 포스트 아이템 렌더링
각 포스트는 다음 정보와 함께 렌더링:
- 제목, 날짜, 저자, 읽기 시간
- 자동 생성되거나 포스트에서 추출된 발췌문
- 태그 페이지로 연결된 태그들

## 6. URL 생성

Jekyll은 다음 기준으로 URL을 생성합니다:
- **카테고리**: 포스트가 카테고리 디렉토리에 배치 (예: `/column/2025/06/28/`)
- **날짜**: 포스트 날짜에서 연도/월/일 구조 생성
- **제목**: 파일명에서 날짜 이후 부분이 URL 슬러그가 됨

## 7. 정적 파일 출력

최종 HTML 파일이 `_site` 디렉토리에 저장됩니다:
- 예: `_posts/2025-06-28-title.md` → `_site/column/2025/06/28/title.html`
- 모든 에셋, 스타일, 스크립트가 `_site`로 복사되거나 컴파일됨

## 8. 추가 처리

여러 Jekyll 플러그인이 빌드를 향상시킵니다:

### jekyll-feed
- 포스트로부터 RSS/Atom 피드 생성
- 구독자를 위한 자동 피드 업데이트

### jekyll-seo-tag
- 각 페이지에 SEO 메타 태그 추가
- Open Graph 및 Twitter 카드 지원

### jekyll-sitemap
- 검색 엔진을 위한 sitemap.xml 생성
- 자동 URL 인덱싱 지원

### jekyll-paginate
- 목록 페이지의 포스트 페이지네이션 처리
- 페이지당 포스트 수 제어

## 주요 설정 요소

`_config.yml`의 핵심 설정:

```yaml
markdown: kramdown          # Markdown 프로세서 지정
plugins:                    # 활성화된 플러그인 목록
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-paginate
  - jekyll-spaceship
lang: "ko"                  # 기본 언어를 한국어로 설정
```

## 빌드 명령

이 모든 과정은 다음 명령 실행 시 자동으로 진행됩니다:

```bash
# 개발 서버 실행 (파일 변경 감지 및 자동 재빌드)
bundle exec jekyll serve

# 프로덕션 빌드
bundle exec jekyll build
```

## 요약

Jekyll의 포스트 처리 시스템은 매우 자동화되어 있어, 개발자는 단순히 `_posts` 폴더에 올바른 형식의 마크다운 파일을 추가하기만 하면 됩니다. Jekyll이 나머지 모든 과정을 처리하여 완전한 정적 HTML 웹사이트를 생성합니다.