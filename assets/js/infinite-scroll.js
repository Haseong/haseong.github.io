(function() {
  // Infinite scroll script loaded
  
  let currentPage = 1;
  let isLoading = false;
  let hasMorePages = true;
  
  // 현재 페이지의 총 페이지 수 확인
  const paginatorIndicator = document.querySelector('.paginator .indicator');
  // Paginator indicator found
  
  if (paginatorIndicator) {
    const match = paginatorIndicator.textContent.match(/(\d+)\/(\d+)/);
    if (match) {
      currentPage = parseInt(match[1]);
      const totalPages = parseInt(match[2]);
      hasMorePages = currentPage < totalPages;
      // Current page and total pages info updated
    }
  }
  
  // 로딩 스피너 엘리먼트 생성
  const loadingElement = document.createElement('div');
  loadingElement.className = 'infinite-scroll-loader';
  loadingElement.innerHTML = '<div class="spinner"></div><p>포스트 로딩 중...</p>';
  loadingElement.style.display = 'none';
  
  const postList = document.querySelector('.post-list');
  if (postList) {
    postList.parentElement.appendChild(loadingElement);
  }
  
  // 다음 페이지 로드 함수
  async function loadNextPage() {
    // loadNextPage called
    if (isLoading || !hasMorePages) return;
    
    isLoading = true;
    loadingElement.style.display = 'block';
    
    try {
      const nextPage = currentPage + 1;
      // 최소화된 버전 파일을 먼저 시도
      const minimalPageUrl = nextPage === 2 ? '/page2/index-posts.html' : `/page${nextPage}/index-posts.html`;
      const fullPageUrl = nextPage === 2 ? '/page2/' : `/page${nextPage}/`;
      // Fetching next page
      
      // 먼저 최소화된 버전을 시도
      let response = await fetch(minimalPageUrl);
      let useMinimal = true;
      
      // 최소화된 버전이 없으면 전체 페이지 요청
      if (!response.ok) {
        // Minimal version not found, trying full page
        response = await fetch(fullPageUrl);
        useMinimal = false;
      }
      // Response received
      if (!response.ok) {
        hasMorePages = false;
        return;
      }
      
      const html = await response.text();
      
      if (useMinimal) {
        // 최소화된 버전은 이미 li 요소들만 포함
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // li 요소들만 추출하여 추가
        const newPosts = tempDiv.querySelectorAll('li');
        newPosts.forEach(post => {
          postList.appendChild(post);
        });
        
        // Posts added from minimal page
      } else {
        // 전체 페이지에서 post-list 추출
        const postListMatch = html.match(/<ul class="post-list">([\s\S]*?)<\/ul>/);
        
        if (postListMatch) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = postListMatch[1];
          
          const newPosts = tempDiv.querySelectorAll('li');
          newPosts.forEach(post => {
            postList.appendChild(post);
          });
          
          // Posts added from full page
        } else {
          // Could not find post-list in response
          hasMorePages = false;
          return;
        }
      }
      
      // 페이지네이션 정보 업데이트
      if (useMinimal) {
        // 최소화된 버전에서는 주석으로 정보 확인
        const paginationInfoMatch = html.match(/<!--P:(\d+)\/(\d+)-->/);
        if (paginationInfoMatch) {
          currentPage = parseInt(paginationInfoMatch[1]);
          const totalPages = parseInt(paginationInfoMatch[2]);
          hasMorePages = currentPage < totalPages;
          // Pagination info updated from minimal
        }
      } else {
        // 전체 페이지에서 정규식으로 추출
        const paginatorMatch = html.match(/<span class="indicator">\s*(\d+)\/(\d+)\s*<\/span>/);
        if (paginatorMatch) {
          currentPage = parseInt(paginatorMatch[1]);
          const totalPages = parseInt(paginatorMatch[2]);
          hasMorePages = currentPage < totalPages;
          // Pagination info updated from full
        }
      }
      
      if (!hasMorePages) {
        // No more pages to load
      }
      
    } catch (error) {
      // Error loading next page
      hasMorePages = false;
    } finally {
      isLoading = false;
      loadingElement.style.display = 'none';
    }
  }
  
  // Intersection Observer로 스크롤 감지
  if ('IntersectionObserver' in window) {
    const options = {
      root: null,
      rootMargin: '300px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      // Intersection observed
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMorePages && !isLoading) {
          loadNextPage();
        }
      });
    }, options);
    
    // 페이지네이터를 관찰 대상으로 설정
    const paginator = document.querySelector('.paginator-wrapper') || document.querySelector('.paginator');
    // Observer target set
    if (paginator) {
      observer.observe(paginator);
    } else {
      // 페이지네이터가 없으면 로딩 요소를 관찰
      // Using loading element as observer target
      observer.observe(loadingElement);
    }
  }
  
  // 항상 스크롤 이벤트도 추가 (폴백)
  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;
    // Scroll event triggered
    
    if (scrollPosition >= documentHeight - 500) {
      loadNextPage();
    }
  });
})();