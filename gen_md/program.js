#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import sharp from 'sharp';
import fetch from 'node-fetch';

// .env 파일 로드
dotenv.config();

// ESM에서 __dirname 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI를 사용한 번역 및 분석 함수
async function analyzeWithGPT(content, title) {
  try {
    const prompt = `
다음 글을 분석해주세요:

제목: ${title}
내용: ${content.substring(0, 3000)}...

다음 작업을 수행해주세요:
1. 제목을 영문으로 번역하여 URL slug로 사용할 수 있도록 변환 (소문자, 하이픈 사용)
2. 글의 주요 주제를 파악하여 5-8개의 영문 태그 생성 (예: markdown, ai-integration, productivity)
3. 글의 핵심 내용을 한국어로 4-5줄로 요약

응답 형식:
{
  "slug": "translated-title-slug",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "한국어 요약 내용"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that analyzes Korean blog posts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = response.choices[0].message.content;
    return JSON.parse(result);
  } catch (error) {
    console.error('OpenAI API 에러:', error.message);
    // 폴백 값 반환
    return {
      slug: title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-'),
      tags: ['blog', 'korean'],
      summary: '(요약 생성 실패)'
    };
  }
}

// Sphere JSON을 Markdown으로 변환하는 함수
function sphereToMarkdown(doc, imagePaths = {}) {
  let markdown = '';
  
  function processNode(node, depth = 0) {
    switch (node.type) {
      case 'doc':
        if (node.content) {
          node.content.forEach(child => {
            processNode(child, depth);
          });
        }
        break;
        
      case 'heading':
        const level = node.attrs?.level || 1;
        const headingText = extractText(node.content);
        markdown += '#'.repeat(level) + ' ' + headingText + '\n\n';
        break;
        
      case 'paragraph':
        const paragraphText = extractText(node.content);
        if (paragraphText.trim()) {
          markdown += paragraphText + '\n\n';
        }
        break;
        
      case 'image':
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || '';
        // 이미지 경로가 변환된 경우 새 경로 사용
        const imagePath = imagePaths[src] || src;
        markdown += `![${alt}](${imagePath})\n\n`;
        break;
        
      case 'bulletList':
      case 'orderedList':
        if (node.content) {
          node.content.forEach((item, index) => {
            const prefix = node.type === 'orderedList' ? `${index + 1}. ` : '- ';
            const indent = '  '.repeat(depth);
            if (item.content) {
              item.content.forEach(child => {
                if (child.type === 'paragraph') {
                  const text = extractText(child.content);
                  markdown += indent + prefix + text + '\n';
                } else {
                  processNode(child, depth + 1);
                }
              });
            }
          });
        }
        markdown += '\n';
        break;
        
      case 'listItem':
        // listItem은 상위 리스트에서 처리
        break;
        
      case 'blockquote':
        if (node.content) {
          const quoteLines = [];
          node.content.forEach(child => {
            const text = processNode(child, depth);
            quoteLines.push(...text.split('\n').filter(line => line.trim()));
          });
          quoteLines.forEach(line => {
            markdown += '> ' + line + '\n';
          });
          markdown += '\n';
        }
        break;
        
      case 'codeBlock':
        const lang = node.attrs?.language || '';
        const code = extractText(node.content);
        markdown += '```' + lang + '\n' + code + '\n```\n\n';
        break;
        
      case 'horizontalRule':
        markdown += '---\n\n';
        break;
        
      default:
        // 알 수 없는 노드 타입은 텍스트만 추출
        if (node.content) {
          node.content.forEach(child => {
            processNode(child, depth);
          });
        }
    }
  }
  
  function extractText(content) {
    if (!content) return '';
    
    let text = '';
    content.forEach(node => {
      if (node.type === 'text') {
        let nodeText = node.text || '';
        
        // 마크 처리
        if (node.marks) {
          node.marks.forEach(mark => {
            switch (mark.type) {
              case 'bold':
                nodeText = `**${nodeText}**`;
                break;
              case 'italic':
                nodeText = `*${nodeText}*`;
                break;
              case 'code':
                nodeText = `\`${nodeText}\``;
                break;
              case 'link':
                const href = mark.attrs?.href || '#';
                nodeText = `[${nodeText}](${href})`;
                break;
              case 'strike':
                nodeText = `~~${nodeText}~~`;
                break;
            }
          });
        }
        
        text += nodeText;
      } else if (node.content) {
        text += extractText(node.content);
      }
    });
    
    return text;
  }
  
  processNode(doc);
  return markdown.trim();
}

// 첫 번째 제목을 찾는 함수
function findFirstHeading(doc) {
  if (!doc.content) return null;
  
  for (const node of doc.content) {
    if (node.type === 'heading' && node.content) {
      const text = node.content
        .filter(n => n.type === 'text')
        .map(n => n.text)
        .join('');
      return text.trim();
    }
  }
  
  return null;
}

// 날짜 포맷팅 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 이미지 다운로드 및 변환 함수
async function downloadAndConvertImage(imageUrl, outputPath) {
  try {
    let imageBuffer;
    
    // Base64 이미지 처리
    if (imageUrl.startsWith('data:')) {
      const base64Data = imageUrl.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } 
    // URL 이미지 처리
    else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } 
    // 로컬 파일 경로 처리
    else {
      // file:// 프로토콜 제거
      let localPath = imageUrl;
      if (localPath.startsWith('file://')) {
        localPath = localPath.substring(7);
      }
      // 로컬 파일을 읽어서 처리
      const localImageBuffer = await fs.readFile(localPath);
      imageBuffer = localImageBuffer;
    }
    
    // Sharp를 사용하여 JPG로 변환
    await sharp(imageBuffer)
      .jpeg({ quality: 95 })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`Failed to process image: ${error.message}`);
    return false;
  }
}

// Jekyll front matter 생성
function createFrontMatter(title, date, tags, summary) {
  const formattedDate = new Date(date).toISOString().replace('T', ' ').substring(0, 19) + ' +0900';
  const tagList = tags.map(tag => tag.trim()).join(', ');
  
  return `---
layout: post
title: "${title}"
date: ${formattedDate}
author: 정하성
categories: [Blog]
tags: [${tagList}]
summary: "${summary.replace(/"/g, '\\"')}"
---

`;
}

// 메인 프로그램
const program = new Command();

program
  .name('sphere-to-markdown')
  .description('Convert Sphere JSON files to Jekyll markdown posts')
  .version('1.0.0')
  .requiredOption('-i, --input <path>', 'Input file or directory path')
  .requiredOption('-o, --output <path>', 'Output directory or file path')
  .parse(process.argv);

const options = program.opts();

async function processFile(inputPath, outputPath) {
  try {
    console.log(`\n📄 Processing: ${path.basename(inputPath)}`);
    
    // JSON 파일 읽기
    const jsonContent = await fs.readFile(inputPath, 'utf-8');
    const doc = JSON.parse(jsonContent);
    
    // 이미지 찾기 및 처리
    const imagePaths = {};
    const imageNodes = [];
    
    // 모든 이미지 노드 찾기
    function findImages(node) {
      if (node.type === 'image' && node.attrs?.src) {
        imageNodes.push(node);
      }
      if (node.content) {
        node.content.forEach(findImages);
      }
    }
    findImages(doc);
    
    // 첫 번째 제목 찾기 (파일명에서 .sp 제거)
    const fileName = path.basename(inputPath, '.sp');
    const firstHeading = findFirstHeading(doc) || fileName;
    
    // Markdown 변환 (이미지 경로는 나중에 처리)
    const markdown = sphereToMarkdown(doc);
    
    // OpenAI API로 분석 (API 키가 있는 경우에만)
    let analysis;
    if (process.env.OPENAI_API_KEY) {
      console.log('   🤖 Analyzing with ChatGPT...');
      analysis = await analyzeWithGPT(markdown, firstHeading);
    } else {
      console.log('   ⚠️  No OpenAI API key found, using fallback values');
      analysis = {
        slug: firstHeading.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-'),
        tags: ['blog'],
        summary: '이 글은 ' + firstHeading + '에 대한 내용입니다.'
      };
    }
    
    // 날짜와 slug로 파일명 생성
    const date = formatDate(new Date());
    const baseFileName = `${date}-${analysis.slug}`;
    
    // 이미지 처리
    if (imageNodes.length > 0) {
      console.log(`   🖼️  Processing ${imageNodes.length} images...`);
      
      // 이미지 저장 디렉토리 생성
      const imageDir = '/Users/hs1512/source/writing/blog/assets/images/posts';
      await fs.mkdir(imageDir, { recursive: true });
      
      for (let i = 0; i < imageNodes.length; i++) {
        const imageNode = imageNodes[i];
        const originalSrc = imageNode.attrs.src;
        const imageFileName = imageNodes.length > 1 ? `${baseFileName}_${i + 1}.jpg` : `${baseFileName}.jpg`;
        const localImagePath = path.join(imageDir, imageFileName);
        const webImagePath = `/assets/images/posts/${imageFileName}`;
        
        console.log(`   📸 Converting image ${i + 1}/${imageNodes.length}...`);
        const success = await downloadAndConvertImage(originalSrc, localImagePath);
        
        if (success) {
          imagePaths[originalSrc] = webImagePath;
        }
      }
    }
    
    // Markdown 다시 변환 (이미지 경로 매핑 포함)
    const markdownWithImages = sphereToMarkdown(doc, imagePaths);
    
    // 출력 파일명 결정
    let outputFilePath;
    if (outputPath.endsWith('.md')) {
      // 특정 파일명이 지정된 경우
      outputFilePath = outputPath;
    } else {
      // 디렉토리가 지정된 경우
      const filename = `${baseFileName}.md`;
      outputFilePath = path.join(outputPath, filename);
    }
    
    // Front matter 추가
    const fullContent = createFrontMatter(
      fileName, // 파일명을 제목으로 사용
      new Date(),
      analysis.tags,
      analysis.summary
    ) + markdownWithImages;
    
    // 디렉토리 생성
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    
    // 파일 쓰기
    await fs.writeFile(outputFilePath, fullContent, 'utf-8');
    
    console.log(`   ✅ Created: ${path.basename(outputFilePath)}`);
    console.log(`   📌 Tags: ${analysis.tags.join(', ')}`);
    console.log(`   📝 Summary: ${analysis.summary.substring(0, 50)}...`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  try {
    const inputPath = path.resolve(options.input);
    const outputPath = path.resolve(options.output);
    
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  Warning: OPENAI_API_KEY not found in .env file');
      console.log('   Translations and summaries will use fallback values\n');
    }
    
    // 입력 경로 확인
    const stats = await fs.stat(inputPath);
    
    if (stats.isFile()) {
      // 단일 파일 처리
      await processFile(inputPath, outputPath);
    } else if (stats.isDirectory()) {
      // 디렉토리의 모든 .sp 파일 처리
      const files = await glob('**/*.sp', { cwd: inputPath });
      
      if (files.length === 0) {
        console.log('No .sp files found in the directory.');
        return;
      }
      
      console.log(`Found ${files.length} .sp files to process...`);
      
      for (const file of files) {
        const fullPath = path.join(inputPath, file);
        await processFile(fullPath, outputPath);
      }
    } else {
      throw new Error('Input path is neither a file nor a directory');
    }
    
    console.log('\n✨ All files processed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();