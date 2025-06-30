# Sphere to Markdown Converter

Sphere 에디터의 JSON 파일(.sp)을 Jekyll 블로그 포스트용 Markdown 파일로 변환하는 Node.js 기반 변환 도구입니다. ChatGPT API를 활용하여 제목 번역, 태그 생성, 요약 생성 기능을 제공합니다.

## 설치

```bash
# 프로젝트 루트에서
cd gen_md
npm install
```

## 설정

1. `.env` 파일을 생성하고 OpenAI API 키를 추가합니다:
```bash
cp .env.example .env
# .env 파일을 편집하여 OPENAI_API_KEY 추가
```

## 사용법

### 단일 파일 변환

```bash
# 프로젝트 루트에서 실행
node gen_md/program.js --input "content/documents/Blog/파일명.sp" --output _posts/

# gen_md 디렉토리에서 실행
cd gen_md
node program.js --input "../content/documents/Blog/파일명.sp" --output ../_posts/

# 출력 파일명 직접 지정
node gen_md/program.js --input "content/documents/Blog/파일명.sp" --output _posts/my-post.md
```

### 디렉토리 일괄 변환

```bash
# 프로젝트 루트에서 실행
node gen_md/program.js --input content/documents/Blog --output _posts/

# gen_md 디렉토리에서 실행
cd gen_md
node program.js --input ../content/documents/Blog --output ../_posts/
```

## 파일명 규칙

- 출력 디렉토리만 지정한 경우: `YYYY-MM-DD-[제목].md` 형식으로 자동 생성
  - 날짜: 현재 날짜
  - 제목: ChatGPT가 번역한 영문 슬러그 사용
- 파일명까지 지정한 경우: 지정한 파일명 사용

## 메타데이터 생성

각 마크다운 파일에는 다음과 같은 Jekyll front matter가 자동으로 추가됩니다:

```yaml
---
layout: post
title: "원본 파일명"
date: YYYY-MM-DD HH:MM:SS +0900
author: 정하성
categories: [Blog]
tags: [tag1, tag2, ...] # ChatGPT가 생성한 태그
summary: "ChatGPT가 생성한 4-5줄 요약"
---
```

## 지원 요소

- 제목 (h1~h6)
- 단락
- 이미지
- 링크
- 볼드, 이탤릭, 코드
- 순서/비순서 리스트
- 인용문
- 코드 블록
- 구분선

## 제한사항

- OpenAI API 키가 없으면 기본값 사용 (영문 번역, 태그, 요약 생성 불가)
- Sphere의 일부 고급 기능은 Markdown에서 지원되지 않을 수 있음
- 중첩된 복잡한 구조는 완벽하게 변환되지 않을 수 있음
- API 호출 비용이 발생할 수 있음 (gpt-4.1-mini 사용)

## 프로그램 구조

```
gen_md/
├── program.js          # 메인 변환 프로그램
├── package.json        # Node.js 의존성
├── .env.example        # 환경 변수 예시
└── .gitignore         # Git 제외 파일
```

## 예시

### 입력 (Sphere JSON - .sp 파일)
```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {"level": 1},
      "content": [{"type": "text", "text": "AI 시대의 컴퓨팅 패러다임 전환"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "본문 내용..."}]
    }
  ]
}
```

### 출력 (Jekyll Markdown)
```markdown
---
layout: post
title: "AI 시대의 컴퓨팅 패러다임 전환"
date: 2025-06-30 12:00:00 +0900
author: 정하성
categories: [Blog]
tags: [ai-era, computing-paradigm, mainframe, cloud-computing]
summary: "이 글은 AI 시대의 컴퓨팅 패러다임 변화를 다루고..."
---

# AI 시대의 컴퓨팅 패러다임 전환

본문 내용...
```