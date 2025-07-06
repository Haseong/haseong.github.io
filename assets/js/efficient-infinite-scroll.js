(function() {
  console.log('Efficient infinite scroll loaded');
  
  let currentPage = 1;
  let isLoading = false;
  let totalPages = 1;
  let postsContainer = null;
  
  // 초기화
  async function init() {
    postsContainer = document.querySelector('.post-list');
    if (!postsContainer) return;
    
    // 기존 Jekyll 생성 컨텐츠 제거
    postsContainer.innerHTML = '';
    
    // 첫 페이지 로드
    await loadPage(1);
    
    // 스크롤 이벤트 설정
    setupScrollListener();
  }
  
  // 페이지 로드
  async function loadPage(pageNum) {
    if (isLoading) return;
    
    isLoading = true;
    showLoader();
    
    try {
      const response = await fetch(`/api/posts-page-${pageNum}.json`);
      if (!response.ok) throw new Error('Failed to load page');
      
      const data = await response.json();
      totalPages = data.total_pages;
      currentPage = data.page;
      
      // 포스트 렌더링
      renderPosts(data.posts);
      
      // 더 이상 페이지가 없으면 스크롤 리스너 제거
      if (currentPage >= totalPages) {
        window.removeEventListener('scroll', handleScroll);
        hideLoader();
      }
      
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      isLoading = false;
      hideLoader();
    }
  }
  
  // 포스트 렌더링
  function renderPosts(posts) {
    posts.forEach(post => {
      const li = document.createElement('li');
      
      // 날짜 계산 (NEW 아이콘용)
      const postDate = new Date(post.date);
      const today = new Date();
      const diffDays = Math.floor((today - postDate) / (1000 * 60 * 60 * 24));
      
      li.innerHTML = `
        <h2 class="post-title">
          <a class="post-link" href="${post.url}">
            ${escapeHtml(post.title)}
          </a>
          ${diffDays <= 3 ? '<span class="new-icon">NEW</span>' : ''}
        </h2>
        <div class="post-meta">
          <span class="post-date"><i class="fa fa-calendar"></i> ${post.formatted_date}</span>
          ${post.author ? `<span class="post-author left-vsplit"><i class="fa fa-user"></i> ${escapeHtml(post.author)}</span>` : ''}
          <span class="post-reading-time left-vsplit"><i class="fa fa-clock-o"></i> ${calculateReadingTime(post.content)} min read</span>
        </div>
        <a class="post-excerpt" href="${post.url}">
          <p>
          ${escapeHtml(post.excerpt)} <span class="read_more">Read More</span>
          </p>
        </a>
        <div class="post-tags">
          ${post.tags.map(tag => `<a class="post-tag" href="/tags.html#${tag}">#${tag}</a>`).join('')}
        </div>
      `;
      
      postsContainer.appendChild(li);
    });
  }
  
  // 읽기 시간 계산
  function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
  
  // HTML 이스케이프
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // 로더 표시/숨김
  let loaderElement = null;
  
  function showLoader() {
    if (!loaderElement) {
      loaderElement = document.createElement('div');
      loaderElement.className = 'infinite-scroll-loader';
      loaderElement.innerHTML = '<div class="spinner"></div><p>포스트 로딩 중...</p>';
      postsContainer.parentElement.appendChild(loaderElement);
    }
    loaderElement.style.display = 'block';
  }
  
  function hideLoader() {
    if (loaderElement) {
      loaderElement.style.display = 'none';
    }
  }
  
  // 스크롤 이벤트 설정
  function setupScrollListener() {
    window.addEventListener('scroll', handleScroll);
  }
  
  function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;
    
    if (scrollPosition >= documentHeight - 500 && !isLoading && currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
  }
  
  // DOM 로드 완료 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();