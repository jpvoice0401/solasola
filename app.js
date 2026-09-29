import { siteData } from './data.js?v=20260927_notices_reorder';

// Application State
const state = {
  currentRoute: 'home',
  currentSubRoute: null,
  selectedPoemIndex: 0,
  selectedFloorIndex: 0
};

// DOM Elements
const elements = {
  header: document.getElementById('site-header'),
  homeView: document.getElementById('home-view'),
  subpageView: document.getElementById('subpage-view'),
  subpageCrumbs: document.getElementById('subpage-crumbs'),
  subpageTitle: document.getElementById('subpage-title'),
  subpageSubtitle: document.getElementById('subpage-subtitle'),
  subpageTabsBar: document.getElementById('subpage-tabs-bar'),
  subpageContentBody: document.getElementById('subpage-content-body'),
  poemSidebarItems: document.getElementById('poem-sidebar-items'),
  poemDisplayPane: document.getElementById('poem-display-pane'),
  stagesContainer: document.getElementById('stages-container'),
  lineageContainer: document.getElementById('lineage-container'),
  spaceTabsList: document.getElementById('space-tabs-list'),
  spaceDisplayImg: document.getElementById('space-display-img'),
  spaceOverlayTitle: document.getElementById('space-overlay-title'),
  spaceOverlayDesc: document.getElementById('space-overlay-desc'),
  homeNoticeList: document.getElementById('home-notice-list'),
  homeBookList: document.getElementById('home-book-list'),
  modalSearch: document.getElementById('modal-search'),
  modalDonation: document.getElementById('modal-donation'),
  modalLightbox: document.getElementById('modal-lightbox'),
  lightboxImg: document.getElementById('lightbox-img'),
  lightboxCaption: document.getElementById('lightbox-caption'),
  searchInput: document.getElementById('search-input'),
  searchResultsBox: document.getElementById('search-results-box'),
  toast: document.getElementById('site-toast')
};

// Initialize Application
function initApp() {
  renderPoemSidebar();
  renderSelectedPoem(0);
  renderStages();
  renderLineage();
  renderSpaceTabs();
  renderHomeNotices();
  renderHomeBooks();
  setupEventListeners();
  handleRouting();
}

// ==========================================================================
// RENDERERS: POEM VIEWER (Exhibition Gallery Style - Full Height Natural Flow)
// ==========================================================================
function renderPoemSidebar() {
  if (!elements.poemSidebarItems) return;
  elements.poemSidebarItems.innerHTML = siteData.tenPoems.map((p, idx) => `
    <button class="poetry-menu-btn ${idx === state.selectedPoemIndex ? 'active' : ''}" data-index="${idx}">
      <span class="poetry-idx">${p.number}</span>
      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; word-break: keep-all;">${p.title.split('—')[0]}</span>
    </button>
  `).join('');

  elements.poemSidebarItems.querySelectorAll('.poetry-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      state.selectedPoemIndex = idx;
      renderPoemSidebar();
      renderSelectedPoem(idx);
    });
  });
}

function renderSelectedPoem(idx) {
  const p = siteData.tenPoems[idx];
  if (!p || !elements.poemDisplayPane) return;

  elements.poemDisplayPane.innerHTML = `
    <div class="poetry-header-block">
      <div class="poetry-category-badge">POEM NO. ${p.number} · ${p.hanja}</div>
      <h3 class="poetry-title-large">${p.title}</h3>
      <div class="poetry-meta-pill-row">
        <span class="poetry-meta-pill"><i class="fa-solid fa-book-bookmark"></i> ${p.book}</span>
        <span class="poetry-meta-pill"><i class="fa-solid fa-tag"></i> 박영근 대표시 10선</span>
      </div>
      <div class="poetry-callout-quote">
        “${p.quote}”
      </div>
    </div>

    <div class="poetry-columns-grid">
      <!-- Left: Poem Text in Pure Serif -->
      <div class="poetry-text-col">
        <div style="font-family: var(--font-en); font-size: 0.78rem; letter-spacing: 0.18em; color: var(--text-muted); margin-bottom: 20px;">
          POETRY VERSES
        </div>
        ${escapeHTML(p.excerpt)}
      </div>

      <!-- Right: Curatorial Notes -->
      <div class="poetry-curation-col">
        <div class="curation-note-box">
          <div class="curation-note-title"><i class="fa-solid fa-compass"></i> 테마 및 주제</div>
          <div class="curation-note-desc" style="font-weight: 600; color: var(--text-primary);">${p.theme}</div>
        </div>

        <div class="curation-note-box">
          <div class="curation-note-title"><i class="fa-solid fa-feather"></i> 작품 심층 해설</div>
          <div class="curation-note-desc">${p.commentary}</div>
        </div>

        <div class="curation-note-box">
          <div class="curation-note-title"><i class="fa-solid fa-monument"></i> 문학사적 의의</div>
          <div class="curation-note-desc">${p.significance}</div>
        </div>

        ${p.buyUrl ? `
          <div style="margin-top: 14px;">
            <a href="${p.buyUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 16px; background: #ffffff; border: 1.5px solid var(--accent-orange); color: var(--accent-orange); font-weight: 700; font-size: 0.88rem; text-decoration: none; transition: all var(--tr-fast); box-shadow: var(--shadow-subtle);" onmouseover="this.style.background='var(--accent-orange)';this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff';this.style.color='var(--accent-orange)';">
              <i class="fa-solid fa-cart-shopping"></i> ${p.buyLabel || '도서 바로가기 / 검색'} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem;"></i>
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ==========================================================================
// RENDERERS: 5 STAGES & LINEAGE & SPACE
// ==========================================================================
function renderStages() {
  if (!elements.stagesContainer) return;
  elements.stagesContainer.innerHTML = siteData.fiveStages.map((s, idx) => `
    <div class="evolution-card">
      <div class="evolution-card-top">
        <div class="evolution-num" style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 800; color: var(--accent-gold);">${s.stage}</div>
        <div class="evolution-period">${s.period}</div>
        <h3 class="evolution-stage-title">${s.name}</h3>
        <div class="evolution-work">${s.work}</div>
      </div>
      <div class="evolution-card-bottom">
        <div class="evolution-spirit">
          ${s.spirit}
        </div>
        <div class="evolution-desc">${s.features}</div>
      </div>
    </div>
  `).join('');
}

function renderLineage() {
  if (!elements.lineageContainer) return;
  elements.lineageContainer.innerHTML = siteData.buanLineage.map(l => `
    <div class="heritage-card">
      <div class="heritage-era">${l.era}</div>
      <h3 class="heritage-name">${l.name}</h3>
      <div class="heritage-role">${l.tag}</div>
      <p class="heritage-desc">${l.desc}</p>
    </div>
  `).join('');
}

function renderSpaceTabs() {
  if (!elements.spaceTabsList) return;
  elements.spaceTabsList.innerHTML = siteData.spaces.map((sp, idx) => `
    <div class="space-select-card ${idx === state.selectedFloorIndex ? 'active' : ''}" data-index="${idx}">
      <div class="space-floor-code">${sp.floorBadge || sp.floor}</div>
      <h3 class="space-card-name">${sp.title}</h3>
      <div class="space-card-en">${sp.titleEn || ''}</div>
      <p class="space-card-detail">${sp.desc}</p>
    </div>
  `).join('');

  elements.spaceTabsList.querySelectorAll('.space-select-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index);
      state.selectedFloorIndex = idx;
      renderSpaceTabs();
      updateSpaceVisual(idx);
    });
  });
}

function updateSpaceVisual(idx) {
  const images = [
    'assets/images/솔아문학예술관.png',
    'assets/images/솔아문학예술관.png',
    'assets/images/솔아문학예술관.png'
  ];
  const titles = [
    '1층 : 박영근 시인 추모 문학관 상설전시실',
    '2층 : 박정근문학예술연구소 & 박지현 갤러리',
    '별채 & 야외 : 예술인의 집 및 야외 정원'
  ];
  const descs = [
    '시인 박영근 생애 연보 및 대표작 안내',
    '문학 연구 세미나실, 생태 미술 상설 및 기획 전시',
    '예술인의 집 창작 레지던시와 야외 정원'
  ];

  if (elements.spaceDisplayImg) elements.spaceDisplayImg.src = images[idx] || images[0];
  if (elements.spaceOverlayTitle) elements.spaceOverlayTitle.textContent = titles[idx] || titles[0];
  if (elements.spaceOverlayDesc) elements.spaceOverlayDesc.textContent = descs[idx] || descs[0];
}

function renderHomeNotices() {
  if (!elements.homeNoticeList) return;
  elements.homeNoticeList.innerHTML = siteData.notices.map(n => `
    <li class="clean-news-item" data-id="${n.id}">
      <div class="news-item-top">
        <span class="news-pill">${n.category}</span>
        <span class="news-date">${n.date}</span>
      </div>
      <div class="news-item-headline">${n.title}</div>
    </li>
  `).join('');

  elements.homeNoticeList.querySelectorAll('.clean-news-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo('community/notices');
    });
  });
}

function renderHomeBooks() {
  if (!elements.homeBookList) return;
  elements.homeBookList.innerHTML = siteData.publications.slice(0, 4).map(b => `
    <div class="foundation-book-card" onclick="window.location.hash='archive/publications'">
      <img src="assets/images/${b.cover}" alt="${b.title}" class="foundation-book-thumb" onerror="this.src='assets/images/아이콘.png'">
      <div class="book-meta-side">
        <span class="book-tag-small">${b.category}</span>
        <h4 class="book-title-bold">${b.title}</h4>
        <div class="book-author-text">${b.author}</div>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// ROUTING & SUBPAGE RENDERER (4-Pillar Streamlined Architecture)
// ==========================================================================
function handleRouting() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const parts = hash.split('/');
  let mainRoute = parts[0] || 'home';
  let subRoute = parts[1] || null;

  // Backward compatibility redirects
  const redirectMap = {
    'about/history': 'about/greeting',
    'about/organization': 'about/greeting',
    'about/donation-info': 'community/donation',
    'poet/chronology': 'poet/bio',
    'poet/publications': 'poet/books',
    'archive/poet-books': 'poet/books',
    'archive/sola-books': 'archive/publications',
    'archive/sola': 'archive/publications',
    'sola-lit': 'archive/publications',
    'sola-lit/magazine': 'archive/publications',
    'sola-lit/award': 'community/notices',
    'sola-lit/debut': 'community/notices',
    'sola-lit/archive-issues': 'archive/publications',
    'sola-lit/submit-guide': 'community/notices',
    'memorial': 'poet/bio',
    'memorial/poet-bio': 'poet/bio',
    'memorial/buan-lineage': 'about/buan-lineage',
    'memorial/poet-themes': 'about/themes',
    'memorial/poet-journey': 'poet/journey',
    'memorial/top10-poems': 'poet/poems',
    'memorial/digital-archive': 'archive/photo-archive',
    'institute': 'about/space',
    'institute/inst-intro': 'about/space',
    'gallery': 'archive/exhibition',
    'gallery/gallery-intro': 'archive/exhibition',
    'community/schedule': 'community/notices',
    'community/publishing': 'archive/publications',
    'community/awards': 'community/notices',
    'community/submission': 'community/notices',
    'community/online-submit': 'community/notices',
    'community/contact-location': 'about/visit'
  };

  const fullPath = subRoute ? `${mainRoute}/${subRoute}` : mainRoute;
  if (redirectMap[fullPath]) {
    const target = redirectMap[fullPath].split('/');
    mainRoute = target[0];
    subRoute = target[1];
  } else if (redirectMap[mainRoute]) {
    const target = redirectMap[mainRoute].split('/');
    mainRoute = target[0];
    subRoute = target[1] || null;
  }

  // Dedicated Standalone Page Routing for ABOUT section
  if (mainRoute === 'about') {
    if (subRoute === 'space') {
      window.location.href = 'about-space.html';
      return;
    } else if (subRoute === 'visit') {
      window.location.href = 'about-visit.html';
      return;
    } else {
      window.location.href = 'about-greeting.html';
      return;
    }
  }

  state.currentRoute = mainRoute;
  state.currentSubRoute = subRoute;

  // Update Header Navigation Active State
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === mainRoute) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  if (mainRoute === 'home') {
    if (elements.homeView) elements.homeView.classList.add('active');
    if (elements.subpageView) elements.subpageView.classList.remove('active');
    window.scrollTo(0, 0);
  } else {
    if (elements.homeView) elements.homeView.classList.remove('active');
    if (elements.subpageView) elements.subpageView.classList.add('active');
    renderSubPage(mainRoute, subRoute);
    window.scrollTo(0, 0);
  }
}

function navigateTo(path) {
  const cleanPath = path ? path.replace(/^#/, '') : 'home';
  if (window.location.hash.replace(/^#/, '') !== cleanPath) {
    window.location.hash = cleanPath;
  }
  handleRouting();
}
window.navigateTo = navigateTo;

function renderSubPage(mainRoute, subRoute) {
  const navItem = siteData.navigation.find(n => n.id === mainRoute);
  if (!navItem) return;

  const currentSub = subRoute || (navItem.subItems ? navItem.subItems[0].id : '');
  
  // Breadcrumbs & Titles
  const subItemObj = navItem.subItems ? navItem.subItems.find(s => s.id === currentSub) : null;
  const pageTitle = subItemObj ? subItemObj.title : navItem.title;

  elements.subpageCrumbs.textContent = `${navItem.title.toUpperCase()} > ${pageTitle.toUpperCase()}`;
  elements.subpageTitle.textContent = pageTitle;
  elements.subpageSubtitle.textContent = getSubtitleForRoute(mainRoute, currentSub);

  // Render Minimalist Subpage Tabs (Text Only, No Icons)
  if (navItem.subItems && navItem.subItems.length > 0) {
    elements.subpageTabsBar.innerHTML = navItem.subItems.map(sub => `
      <button class="subpage-tab-item ${sub.id === currentSub ? 'active' : ''}" data-sub="${sub.id}">
        <span>${sub.title}</span>
      </button>
    `).join('');

    elements.subpageTabsBar.querySelectorAll('.subpage-tab-item').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateTo(`${mainRoute}/${btn.dataset.sub}`);
      });
    });
  } else {
    elements.subpageTabsBar.innerHTML = '';
  }

  // Render Subpage HTML with Rich Text and Images
  elements.subpageContentBody.innerHTML = getSubpageHTML(mainRoute, currentSub);
  attachSubpageInteractiveHandlers(mainRoute, currentSub);
}

function getSubtitleForRoute(main, sub) {
  const map = {
    // 1. ABOUT
    'greeting': '솔아문학예술관 설립이념 및 대표 박정근 인사말 · 감사의 헌정',
    'themes': '노동·민중·여성·생명·존재로 나아가는 박영근 시세계의 5대 핵심 테마',
    'space': '전북 부안 변산 300평 복합 문화예술관 층별 공간 구조 및 시설 안내',
    'buan-lineage': '매창, 신석정, 김민성, 박영근으로 이어지는 문향 부안 4대 시인 계보',
    'visit': '전북특별자치도 부안군 변산면 산기길 10 오시는 길 및 개관 관람 안내',

    // 2. POET
    'bio': '대한민국 최초의 노동시인이자 민중·생명시인 박영근의 생애와 연보 (1958~2006)',
    'poems': '문학사적 의의와 독보적 서정을 담은 박영근 대표시 10선 원문 및 심층 해설',
    'journey': '수유리에서 별자리에 누워 흘러가다까지 5단계 문학 발전사',
    'books': '실천문학사, 창작과비평사, 청사, 풀빛 등 한국 대표 출판사에서 출간된 박영근 시인의 제1시집부터 유고시집·전집 전권 컬렉션',
    'monument': '솔아문학예술관 및 부천에 건립된 박영근 시비와 시대의 노래 「솔아 솔아 푸른 솔아」',

    // 3. ARCHIVE
    'exhibition': '박영근 시인 특별 유품전 및 박지현 갤러리 생태·현대미술 상설 기획 전시',
    'poet-books': '실천문학사, 창작과비평사, 청사, 풀빛 등 한국 대표 출판사에서 출간된 박영근 시인의 시집·전집·산문집',
    'sola-books': '15년 황야문학의 맥을 잇는 계간 『솔아문학』 재창간호 및 도서출판 솔아·연구총서 출간물',
    'publications': '15년 황야문학의 맥을 잇는 계간 『솔아문학』 재창간호 및 도서출판 솔아·연구총서 출간물',
    'photo-archive': '박영근 시인 생전 활동 사진, 육필 원고 및 역사적 아카이브 갤러리',

    // 4. COMMUNITY
    'notices': '솔아문학예술관 개관식(2026. 7. 17) 및 정기 문화행사·공지사항',
    'research-cafe': '박영근 시학 연구와 계간 『솔아문학』 창작 담론을 실시간으로 나누는 열린 학술·문학 커뮤니티',
    'donation': '박영근 문학유산 보존과 청년 작가 창작 지원을 위한 솔아 후원회 안내'
  };
  return map[sub] || '솔아문학예술 공식 플랫폼';
}

function renderBookCardHTML(b) {
  return `
    <div class="visual-gallery-card" data-lightbox="assets/images/${b.cover}" data-caption="${b.title} (${b.author})">
      <div class="visual-img-container" style="height: 280px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; padding: 16px;">
        <img src="assets/images/${b.cover}" alt="${b.title}" style="max-height: 100%; max-width: 100%; object-fit: contain; box-shadow: 0 4px 14px rgba(0,0,0,0.12); transition: transform 0.4s ease;" onerror="this.src='assets/images/아이콘.png'">
        <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
      </div>
      <div class="visual-card-body" style="display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="visual-card-tag">${b.category}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-en);">${b.date}</span>
          </div>
          <div class="visual-card-title">${b.title}</div>
          <div class="visual-card-desc" style="font-weight: 600; color: var(--accent-orange); margin-bottom: 8px;">${b.author} · ${b.publisher}</div>
          <div class="visual-card-desc" style="line-height: 1.65; word-break: keep-all; margin-bottom: 16px;">${b.desc}</div>
        </div>
        ${b.buyUrl ? `
          <div style="padding-top: 14px; border-top: 1px dashed var(--border-light); margin-top: auto;">
            <a href="${b.buyUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px 14px; background: #ffffff; border: 1.5px solid var(--accent-orange); color: var(--accent-orange); font-weight: 700; font-size: 0.86rem; text-decoration: none; border-radius: 2px; transition: all var(--tr-fast);" onclick="event.stopPropagation();" onmouseover="this.style.background='var(--accent-orange)';this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff';this.style.color='var(--accent-orange)';">
              <i class="fa-solid fa-cart-shopping"></i> ${b.buyMall === '정기구독 문의' ? '정기구독 및 도서 문의' : b.buyMall === '도서출판 솔아 문의' ? '도서출판 솔아 문의' : '도서 바로가기 / 검색'} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem;"></i>
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function getSubpageHTML(main, sub) {
  switch (sub) {
    // =========================================================================
    // 1. ABOUT SOLA (문학관 소개 - 인사말 & 설립이념 / 공간 & 시설 / 오시는 길)
    // =========================================================================
        case 'greeting':
      return `
        <div style="max-width: 960px; margin: 0 auto;">
          <div style="background: transparent; padding: 10px 0 40px 0; border: none; box-shadow: none;">
            
            <!-- 1. FOUNDER & DIRECTOR PROFILE (상단 배치) -->
            <div style="margin-bottom: 48px; background: transparent;">
              <div style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px;">
                FOUNDER &amp; DIRECTOR PROFILE
              </div>

              <div class="profile-responsive-grid" style="background: transparent; padding: 0;">
                
                <!-- Portrait Image -->
                <div style="width: 190px; height: 245px; overflow: hidden; background: #f0eee9; margin: 0;">
                  <img src="assets/images/park_jeong_geun.png" alt="솔아문학예술관 설립자 · 대표 박정근" style="width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block;">
                </div>

                <!-- Profile Details (사진 높이 245px에 완벽 정렬) -->
                <div class="founder-profile-info" style="display: flex; flex-direction: column; justify-content: space-between; height: 245px; padding: 1px 0;">
                  <div>
                    <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
                      <h3 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.15; letter-spacing: 0.02em;">
                        박정근
                      </h3>
                      <span style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600; color: var(--accent-pine);">
                        | 문학박사
                      </span>
                    </div>

                    <div style="font-family: var(--font-sans); font-size: 0.98rem; font-weight: 700; color: var(--accent-orange); letter-spacing: 0.02em; line-height: 1.3;">
                      시인 · 소설가 · 극작가 · 연출가 · 성악가
                    </div>
                  </div>

                  <div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.96rem; color: var(--text-secondary); line-height: 1.9; font-family: var(--font-sans);">
                      <li>전 대진대학교 영어영문학과 교수</li>
                      <li>제17대 한국셰익스피어학회 회장</li>
                      <li>계간 『황야문학』 주간</li>
                      <li style="margin-top: 2px;"><strong style="color: var(--text-primary); font-size: 0.98rem;">솔아문학예술관 설립자 · 대표</strong></li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            <!-- 2. DIRECTOR'S ESSAY HEADER (대표의 글 안내) -->
            <div style="margin-bottom: 32px;">
              <div style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px;">
                DIRECTOR'S ESSAY · 설립 인사말 &amp; 이념
              </div>
              <h3 style="font-family: var(--font-serif); font-size: clamp(1.35rem, 2.2vw, 1.75rem); font-weight: 700; color: var(--text-primary); margin: 0 0 24px 0; line-height: 1.45;">
                “고향 변산의 갯벌과 푸른 솔, 인간의 영혼을 밝히는 문학의 성소로”
              </h3>
            </div>

            <!-- Continuous Prose Body written by Director Park Jeong-geun -->
            <div style="font-family: var(--font-serif); font-size: 1.08rem; line-height: 2.25; color: #222222; text-align: justify; word-break: keep-all;">

              <p style="margin-bottom: 24px;">
                안녕하십니까.<br>
                솔아문학예술관 설립자 박정근입니다.
              </p>

              <p style="margin-bottom: 24px;">
                저는 평생 대학 강단에서 영미문학과 셰익스피어를 가르치고 연구해 온 학자입니다. 한국셰익스피어학회 제17대 회장으로서 셰익스피어 연구와 학술 교류에도 힘써 왔습니다. 시와 소설을 쓰는 작가로, 희곡을 쓰고 연출하며 직접 무대에 서는 연극인으로, 그리고 노래하는 성악가로 살아왔습니다. 계간 『황야문학』을 펴내며 문학의 순수성과 시대정신을 지키는 일 또한 오랫동안 제게 주어진 소명이라 생각해 왔습니다.
              </p>

              <p style="margin-bottom: 24px;">
                대학에서 정년을 맞은 뒤, 저는 유년의 기억이 고스란히 남아 있는 고향 부안 변산으로 돌아왔습니다. 흙을 일구고 솔바람 소리를 벗 삼아 글을 쓰는 나날은 더없이 평온했습니다. 그런데 그 고요 속에서 오랫동안 마음 한편에 남아 있던 하나의 빚을 다시 마주하게 되었습니다.
              </p>

              <p style="margin-bottom: 24px;">
                그 빚은 고(故) 박영근(1958~2006) 시인에게 진 것이었습니다.
              </p>

              <p style="margin-bottom: 24px;">
                1980년대 박영근 시인은 구로공단과 인천의 노동 현장 한복판에서 살아가는 사람들의 눈물과 아픔, 그리고 존엄을 온몸으로 노래했습니다. 신동엽문학상과 백석문학상은 그의 문학적 성취를 기렸습니다. 그의 시에서 태어난 노래 「솔아 솔아 푸르른 솔아」는 한 시대를 기억하게 하는 상징적인 노래로 남았습니다.
              </p>

              <p style="margin-bottom: 24px;">
                그러나 정작 시인의 젖줄이자 마지막 안식처인 고향 부안에는 그의 이름과 문학을 꾸준히 기억하고 연구할 공간이 충분히 마련되지 못했습니다. 같은 고향에서 문학을 해 온 사람으로서 저는 그 사실을 오랫동안 안타깝게 생각해 왔습니다.
              </p>

              <p style="margin-bottom: 24px;">
                그 마음이 저를 움직였습니다. 사재를 들여 변산 고사포 송림 곁 약 300평의 터에 솔아문학예술관을 세운 까닭입니다.
              </p>

              <p style="margin-bottom: 24px;">
                제가 박영근의 문학에서 특히 귀하게 여기는 것은 확장과 승화의 정신입니다. 그의 문학은 노동 현장의 현실과 분노에만 머물지 않았습니다. 새만금 방조제 건설로 고향의 갯벌이 사라져 가는 모습을 바라보며, 그의 시선은 인간과 자연, 생명과 공동체의 문제로 넓어졌습니다.
              </p>

              <p style="margin-bottom: 24px;">
                시인에게 갯벌은 수많은 생명을 품고 길러 내며 스스로를 정화하는 살아 있는 생명의 공간이었습니다. 해창 갯벌을 바라보며 써 내려간 〈해창에서〉에는 사라져 가는 자연과 생명을 향한 시인의 절박한 마음이 깊이 새겨져 있습니다.
              </p>

              <p style="margin-bottom: 24px;">
                박영근의 문학은 시에서 끝나지 않습니다.
              </p>

              <p style="margin-bottom: 24px;">
                그가 남긴 산문에는 시로 모두 표현하지 못한 삶의 결, 시대에 대한 고민, 인간과 자연에 대한 사유가 담겨 있습니다. 그동안 박영근 문학에 대한 관심과 연구는 주로 시에 집중되어 왔지만, 그의 산문 또한 함께 읽고 연구할 필요가 있습니다.
              </p>

              <p style="margin-bottom: 24px;">
                시와 산문을 나란히 놓고 바라볼 때 우리는 비로소 한 인간이자 작가로서의 박영근을 더욱 온전히 만날 수 있을 것입니다. 그의 문학 세계 전체를 깊이 들여다보는 일은 앞으로 솔아문학예술관이 이어 가야 할 중요한 과제이기도 합니다.
              </p>

              <p style="margin-bottom: 24px;">
                오늘 우리는 인공지능과 거대 자본, 빠르게 변화하는 기술이 인간의 삶과 가치관을 새롭게 재편하는 시대를 살아가고 있습니다. 이러한 시대일수록, 인간의 존엄과 생명의 가치를 끝까지 붙들고자 했던 문학의 언어는 더욱 중요한 의미를 지닙니다.
              </p>

              <p style="margin-bottom: 24px;">
                솔아문학예술관은 한 시인을 추모하고 지난 시간을 기억하는 기념 공간에 머물지 않으려 합니다. 문학과 예술을 통해 인간의 영혼과 생명의 존엄을 돌아보는 살아 있는 인문예술의 공간, 그것이 우리가 지향하는 솔아문학예술관의 모습입니다. 이를 위해 문학과 연구, 예술을 한 공간에 모았습니다.
              </p>

              <p style="margin-bottom: 24px;">
                황야의 바람 속에서도 푸르름을 잃지 않는 소나무처럼, 이곳이 삶에 지친 이들의 마음과 영혼을 품어 주는 공간이 되기를 바랍니다. 변산의 파도 소리와 솔바람 곁에서 문학과 예술을 만나고, 박영근 시인의 숨결과 우리가 살아가는 시대의 의미를 함께 나누는 자리가 되었으면 합니다.
              </p>

              <p style="margin-bottom: 28px;">
                솔아문학예술관에서 여러분을 만나 뵐 날을 기다리겠습니다.
              </p>

              <p style="margin-bottom: 36px; font-weight: 600;">
                감사합니다.
              </p>

              <!-- Formal Closing Sign-off -->
              <div style="margin-top: 40px; padding-top: 16px; text-align: right;">
                <strong style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); letter-spacing: 0.02em;">
                  솔아문학예술관 설립자 · 대표 박정근 올림
                </strong>
              </div>

            </div>

          </div>
        </div>
      `;

        case 'space':
      return `
        <div style="max-width: 100%; margin: 0 auto;">
          
          <!-- Space Intro Statement -->
          <div style="padding: 0 0 32px 0; margin-bottom: 28px;">
            <div style="font-family: var(--font-en); font-size: 0.82rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.18em; margin-bottom: 10px; text-transform: uppercase;">
              SCALE &amp; ARCHITECTURE · 300평 복합 문화예술 공간
            </div>
            <h2 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 2.5vw, 2.4rem); color: var(--text-primary); margin-bottom: 14px; line-height: 1.35;">
              고사포 해송림과 서해 바다가 품어 안은 예술인의 집
            </h2>
            <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.9; max-width: 1100px; word-break: keep-all;">
              솔아문학예술관은 전북특별자치도 부안군 변산면 고사포해수욕장 곁에 위치하며, 
              <strong>연면적 993㎡ (약 300평)</strong> 대지 위에 박영근 시인 추모기념관, 박정근문학예술연구소, 박지현갤러리, 야외 정원, 창작 레지던시(예술인의 집)를 유기적으로 배치한 열린 복합 인문예술 플랫폼입니다.
            </p>
          </div>

          <!-- Unified Architectural Showcase: Facade Photo + Integrated Floor Guides -->
          <div class="space-overview-split" style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; margin-bottom: 52px; align-items: stretch;">
            
            <!-- Left: Building Facade Image -->
            <div style="position: relative; height: 100%; min-height: 520px; overflow: hidden; background: #111111; display: flex; border-radius: 4px;">
              <img src="assets/images/솔아문학예술관.png" alt="솔아문학예술관 전경" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='assets/images/sola_building_facade.png'">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); padding: 28px 24px 20px; color: #ffffff;">
                <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; letter-spacing: 0.18em; color: var(--accent-gold); text-transform: uppercase;">
                  SOLA ARTS &amp; LITERATURE CENTER
                </div>
                <div style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; margin-top: 4px;">
                  솔아문학예술관 본관 및 야외 정원 전경
                </div>
                <div style="font-size: 0.88rem; color: rgba(255,255,255,0.8); margin-top: 4px;">
                  전북 부안군 변산면 산기길 10 · 대지 및 연면적 약 300평
                </div>
              </div>
            </div>

            <!-- Right: Comprehensive Floor Guides -->
            <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 24px;">
              
              <!-- Floor 01: 박영근 추모 기념관 -->
              <div style="padding: 4px 0;">
                <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; letter-spacing: 0.16em; color: var(--accent-pine); text-transform: uppercase; margin-bottom: 6px;">
                  01F · EXHIBITION &amp; ARCHIVE
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">
                  1층 : 박영근 추모 기념관 (상설전시관)
                </h3>
                <ul style="font-size: 0.96rem; color: var(--text-secondary); line-height: 1.85; padding-left: 18px; margin: 0; word-break: keep-all;">
                  <li>시인 박영근 생애 연보</li>
                </ul>
              </div>

              <!-- Floor 02: 박정근연구소 & 박지현갤러리 -->
              <div style="padding: 4px 0;">
                <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; letter-spacing: 0.16em; color: var(--accent-orange); text-transform: uppercase; margin-bottom: 6px;">
                  02F · RESEARCH &amp; GALLERY
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">
                  2층 : 박정근연구소 &amp; 박지현갤러리
                </h3>
                <ul style="font-size: 0.96rem; color: var(--text-secondary); line-height: 1.85; padding-left: 18px; margin: 0; word-break: keep-all;">
                  <li>박정근교수의 문학예술연구소, 학술 세미나실 및 문학도서 아카이브</li>
                  <li>박지현교수의 현대미술 상설 및 기획 전시실</li>
                </ul>
              </div>

              <!-- Annex & Outdoor: 별채 & 야외 정원 -->
              <div style="padding: 4px 0;">
                <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; letter-spacing: 0.16em; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 6px;">
                  ANNEX &amp; OUTDOOR PARK
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">
                  별채 &amp; 야외 정원
                </h3>
                <ul style="font-size: 0.96rem; color: var(--text-secondary); line-height: 1.85; padding-left: 18px; margin: 0; word-break: keep-all;">
                  <li>야외 정원</li>
                  <li>예술인의 집</li>
                  <li>주차 및 산책로</li>
                </ul>
              </div>

            </div>

          </div>

          <!-- Bottom Core Summary Bar -->
          <div class="space-specs-strip">
            <div>
              <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px;">
                SCALE
              </div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                연면적 993㎡ (300평)
              </div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">
                지상 2개 층 본관 및 창작 별채
              </div>
            </div>

            <div>
              <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; color: var(--accent-pine); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px;">
                ADMISSION
              </div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-pine); margin-bottom: 4px;">
                전액 무료 (사전 예약제)
              </div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">
                쾌적하고 깊이 있는 관람 환경 제공
              </div>
            </div>

            <div>
              <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; color: var(--accent-orange); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px;">
                FACILITIES
              </div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                60석 다목적 세미나홀
              </div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">
                음향·영상 시설 및 북토크 공간
              </div>
            </div>

            <div>
              <div style="font-family: var(--font-en); font-size: 0.76rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 6px;">
                PARKING
              </div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                관람객 무료 주차장
              </div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">
                솔아문학예술관에 문의
              </div>
            </div>
          </div>

        </div>
      `;

    case 'buan-lineage':
      return `
        <div style="width: 100%;">
          <div style="background: var(--bg-subtle); border-left: 4px solid var(--accent-gold); padding: 22px 28px; margin-bottom: 36px;">
            <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 8px;">
              문향(文鄕) 부안이 낳은 4대 시인의 문학사적 계보
            </h3>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.8;">
              전북 부안은 조선 중기 이매창에서부터 일제강점기 신석정, 서정주, 그리고 현대의 박영근에 이르기까지 
              한국 문학사의 찬란한 서정과 저항, 생명의 맥을 이어온 자랑스러운 문학의 고향입니다.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 36px;">
            ${siteData.buanLineage.map(l => `
              <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 30px; transition: border-color var(--tr-fast);">
                <div style="font-family: var(--font-en); font-size: 0.8rem; font-weight: 800; color: var(--accent-orange); letter-spacing: 0.12em;">${l.era}</div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--text-primary); margin: 6px 0 4px 0;">${l.name}</h3>
                <div style="font-size: 0.88rem; color: var(--accent-pine); font-weight: 700; margin-bottom: 12px;">${l.tag}</div>
                <p style="font-size: 0.93rem; color: var(--text-secondary); line-height: 1.8; word-break: keep-all;">${l.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    // =========================================================================
    // 2. PARK YOUNG-GEUN (박영근 시인)
    // =========================================================================
    case 'bio':
      return `
        <div style="width: 100%;">
          <!-- Section 01: Poet Hero & Biography (No Artificial Box Sections, Expansive Editorial) -->
          <div class="poet-bio-hero-wrap">
            
            <!-- Expansive Large Photo Showcase (Background + Face Prominent, White Gradient Removed) -->
            <div class="poet-bio-panorama-frame" data-lightbox="assets/images/박영근.jpg" data-caption="시인 박영근 (1958. 9. 3 ~ 2006. 5. 11) · 전북 부안 변산 채석강">
              <img src="assets/images/박영근.jpg" alt="시인 박영근">
              <div class="poet-panorama-overlay">
                <div>
                  <div class="poet-panorama-name">시인 박영근 (朴永根)</div>
                  <div class="poet-panorama-years">1958. 9. 3 ~ 2006. 5. 11 · 전북특별자치도 부안 출생</div>
                </div>
                <span class="visual-zoom-badge" style="position: static; transform: none; display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.82rem; background: rgba(0,0,0,0.6);"><i class="fa-solid fa-magnifying-glass-plus"></i> 원본 확대</span>
              </div>
            </div>

            <!-- Flowing Editorial Narrative -->
            <div class="poet-bio-narrative-flow">
              <div class="poet-bio-badge">POET BIOGRAPHY &amp; SPIRIT</div>
              <h3 class="poet-bio-title">
                한국 현대시의 거목, 신동엽 이후 민중서정의 적자
              </h3>
              <div class="poet-bio-prose">
                <p style="margin-bottom: 14px;">
                  1958년 전북 부안에서 태어난 박영근 시인은 부안 마포초등학교에 입학하여 익산 중앙초등학교,<br>
                  남성중학교(23회)를 졸업하고 전주고 1학년 때 학업을 중단했습니다.
                </p>
                <p style="margin-bottom: 14px;">
                  1974년 16세 나이로 상경하여 공장 노동자로 일하며 산업화 시대 노동 현장의 실상을 온몸으로 체험하였고<br>
                  1981년 동인지 『반시』 6집과 『실천문학』 2호에 「수유리에서」 등을 발표하며 문단에 나왔습니다.
                </p>
                <p style="margin-bottom: 0;">
                  이후 제12회 신동엽창작기금과 제5회 백석문학상을 수상하였으며, 그의 대표작 「솔아 솔아 푸르른 솔아」는<br>
                  시대의 어둠을 밝히는 노래로 널리 불리며 한국 민중문학사의 찬란한 금자탑이 되었습니다.
                </p>
              </div>

              <div class="poet-bio-meta-row-clean">
                <div class="poet-meta-item">
                  <div class="poet-meta-label">주요 수상</div>
                  <div class="poet-meta-value">
                    <span>제12회 신동엽창작기금 (1994)</span>
                    <span>제5회 백석문학상 (2003)</span>
                  </div>
                </div>
                <div class="poet-meta-item">
                  <div class="poet-meta-label">주요 활동</div>
                  <div class="poet-meta-value">
                    <span>민중문화운동협의회 · 민중문화운동연합</span>
                    <span>민족문학작가회의 인천지회 부회장 · 인천민예총 부지회장</span>
                    <span>민족문학작가회의 시분과위원장 및 이사</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Section 02: Major Works Collection (Seamless Editorial Plane) -->
          <div class="subpage-section-header">
            <div>
              <div class="subpage-section-tag">ARCHIVE COLLECTION</div>
              <h4 class="subpage-section-title">박영근 시인 주요 저작</h4>
            </div>
            <span class="subpage-section-meta">생전 시집 5권 · 정본 전집 · 유고 및 추모 시집</span>
          </div>

          <div class="poet-books-grid">
            ${siteData.poet.books.map(b => `
              <div class="poet-book-card">
                <div>
                  <div class="poet-book-header">
                    <span class="poet-book-type">${b.year} · ${b.type}</span>
                    <span class="poet-book-publisher">${b.publisher}</span>
                  </div>
                  <h5 class="poet-book-title">『${b.title}』</h5>
                  <p class="poet-book-desc">${b.desc}</p>
                </div>
                ${b.buyUrl ? `
                  <div class="poet-book-footer">
                    <a href="${b.buyUrl}" target="_blank" rel="noopener noreferrer" class="poet-book-link">
                      <i class="fa-solid fa-cart-shopping"></i> 도서 바로가기 / 검색 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i>
                    </a>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- Section 03: Chronology Timeline -->
          <div class="subpage-section-header">
            <div>
              <div class="subpage-section-tag">CHRONOLOGY OF LIFE</div>
              <h4 class="subpage-section-title">박영근 시인 생애 연보 (Chronology)</h4>
              <div class="subpage-section-meta" style="margin-top: 6px;">1958년 탄생부터 2006년 영면까지의 연대기</div>
            </div>
          </div>

          <div class="poet-chronology-flow">
            ${siteData.poet.career.map(c => `
              <div class="poet-chrono-item">
                <div class="poet-chrono-dot"></div>
                <div class="poet-chrono-year">${c.year}</div>
                <div class="poet-chrono-desc">${c.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'poems':
      return `
        <div style="max-width: 100%;">
          
          <!-- Criteria Header -->
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 22px 28px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.15em;">SELECTION CRITERIA</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
                ① 문학사적 영향력 · ② 시 세계의 발전 과정 · ③ 예술성과 독창성 · ④ 현대적 울림
              </div>
            </div>
            <div style="font-size: 0.88rem; color: var(--accent-pine); font-weight: 700; background: #ffffff; padding: 8px 16px; border: 1px solid var(--border-light);">
              박영근 대표시 10선 전편 전문 & 해설 수록
            </div>
          </div>

          <div class="poetry-gallery-frame" style="margin-top: 0;">
            
            <!-- Sidebar Poem Selector -->
            <div class="poetry-sidebar" id="subpage-poem-sidebar">
              <div class="poetry-sidebar-head">
                REPRESENTATIVE 10 POEMS
              </div>
              <div id="subpage-poem-items">
                ${siteData.tenPoems.map((p, idx) => `
                  <button class="poetry-menu-btn ${idx === state.selectedPoemIndex ? 'active' : ''}" data-poem-index="${idx}">
                    <span class="poetry-idx">${p.number}</span>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; word-break: keep-all;">${p.title.split('—')[0]}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Poem Display Pane -->
            <div class="poetry-stage-view" id="subpage-poem-stage">
              <!-- Rendered via renderSubpageSelectedPoem -->
            </div>

          </div>
        </div>
      `;

    case 'journey':
      return `
        <div style="width: 100%;">
          <div style="background: var(--bg-subtle); border-left: 4px solid var(--accent-orange); padding: 22px 28px; margin-bottom: 36px; text-align: center;">
            <p style="font-size: 1.05rem; color: var(--text-primary); font-weight: 600; line-height: 1.8; margin: 0;">
              노동의 현장에서 인간의 존엄을 묻고, 민중의 역사에서 공동체의 희망을 보았으며,<br>
              고향과 자연을 거쳐 존재의 심연에 이른 박영근 시학의 5단계 발전사입니다.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
            ${siteData.fiveStages.map((s, idx) => `
              <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 34px; border-left: 6px solid var(--accent-orange); transition: border-color var(--tr-fast);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                  <span style="font-family: var(--font-serif); font-weight: 800; font-size: 1.25rem; color: var(--accent-gold);">
                    ${s.stage} <span style="font-family: var(--font-sans); font-size: 0.95rem; font-weight: 500; color: var(--text-secondary); margin-left: 6px;">(${s.period})</span>
                  </span>
                  <span style="font-size: 0.88rem; font-weight: 700; color: var(--accent-pine); background: var(--bg-subtle); padding: 6px 14px; border: 1px solid var(--border-light);">
                    대표작 : ${s.work}
                  </span>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--text-primary); margin-bottom: 8px;">
                  ${s.name}
                </h3>
                <div style="font-size: 0.92rem; font-weight: 700; color: var(--accent-orange); margin-bottom: 14px;">
                  핵심 시정신 : ${s.spirit}
                </div>
                <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.85; word-break: keep-all; margin: 0;">
                  ${s.features}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'monument':
      return `
        <div style="width: 100%;">
          
          <!-- Monuments and Historical Photos 3-Card Grid -->
          <div class="visual-gallery-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 36px;">
            
            <!-- 1. 솔아문학예술관 박영근 시비 -->
            <div class="visual-gallery-card" data-lightbox="assets/images/monument_sola.jpg" data-caption="솔아문학예술관 박영근 시비 (「새야 새야 — 백제 · 마지막 노래」 각석 시비)">
              <div class="visual-img-container" style="height: 260px;">
                <img src="assets/images/monument_sola.jpg" alt="솔아문학예술관 박영근 시비" style="object-fit: cover; object-position: center 25%;">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">SOLA MEMORIAL MONUMENT</div>
                <div class="visual-card-title">솔아문학예술관 박영근 시비</div>
                <div class="visual-card-desc">전북 부안 솔아문학예술관 야외 정원에 건립된 대표시 「새야 새야」(백제·마지막 노래) 각석 시비 (남성 203 동창회 후원)</div>
              </div>
            </div>

            <!-- 2. 부천 박영근 시비 -->
            <div class="visual-gallery-card" data-lightbox="assets/images/박영근시비.jpg" data-caption="부천 박영근 시비 (「솔아 솔아 푸른 솔아」 친필 각석)">
              <div class="visual-img-container" style="height: 260px;">
                <img src="assets/images/박영근시비.jpg" alt="부천 박영근 시비" style="object-fit: cover; object-position: center center;">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">BUCHEON MEMORIAL MONUMENT</div>
                <div class="visual-card-title">부천 박영근 시비</div>
                <div class="visual-card-desc">경기도 부천 솔안공원에 건립된 시인의 대표작 「솔아 솔아 푸른 솔아」 친필 각석 시비</div>
              </div>
            </div>

            <!-- 3. 예술과 삶을 나눈 동지들 -->
            <div class="visual-gallery-card" data-lightbox="assets/images/조찬준, 최병수, 박영근.jpg" data-caption="박영근 시인과 동지들 (조찬준, 최병수 작가)">
              <div class="visual-img-container" style="height: 260px;">
                <img src="assets/images/조찬준, 최병수, 박영근.jpg" alt="박영근 시인과 동지들" style="object-fit: cover; object-position: center top;">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">HISTORICAL PHOTO</div>
                <div class="visual-card-title">예술과 삶을 나눈 동지들</div>
                <div class="visual-card-desc">민중미술가 최병수, 조찬준 등과 함께한 박영근 시인 생전의 모습</div>
              </div>
            </div>

          </div>

          <!-- Section 1: Sol-a Literature & Arts Museum Monument Description -->
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 36px; margin-bottom: 30px;">
            <div style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;">
              SOLA ARTS &amp; LITERATURE MONUMENT
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 16px;">
              솔아문학예술관 시비 — 「새야 새야 (백제 · 마지막 노래)」
            </h4>
            <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 2.05; word-break: keep-all; margin-bottom: 24px;">
              전북 부안 변산 솔아문학예술관 야외 정원에 건립된 이 시비는 시인의 모교 남성 203 동창회(남성중 20회, 남성고 23회)의 뜻깊은 후원으로 세워졌습니다.<br>
              동학농민혁명의 발상지 고부와 부안의 대지 위에 서린 민중의 한과 역사의 비장미를 녹여낸 명시 「새야 새야」<br>
              (부제: 백제·마지막 노래)가 자연석에 정성껏 각석되어 문학관을 찾는 방문객들을 맞이합니다.
            </p>
            <div style="font-family: var(--font-serif); font-size: 1.02rem; color: var(--text-primary); line-height: 2.1; background: #ffffff; padding: 26px 30px; border: 1px solid var(--border-light); border-left: 4px solid var(--accent-gold); display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
              <div>
                새야 새야<br>
                전주고부 녹두새야<br>
                백설이 펄펄 휘날리는<br>
                동지 섣달 분명한데<br>
                너 어이 나왔느냐<br>
                서러운 하늘 옛 노래 따라<br>
                녹두 꽃은 떨어져서
              </div>
              <div>
                나라여 나라여 부르는<br>
                이름 어둡고<br>
                돌아서는 밭길 잦나니<br>
                윗녘새야 아랫녘새야<br>
                전주 고부 녹두새야<br>
                시호시호 시호로세<br>
                칼춤추던 좋은 시절<br>
                다시보러 나왔느냐
              </div>
            </div>
          </div>

          <!-- Section 2: Bucheon Monument & Sola Song -->
          <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 36px; margin-bottom: 30px;">
            <div style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: var(--accent-pine); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;">
              THE ERA'S ANTHEM &amp; BUCHEON MONUMENT
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 16px;">
              시대의 노래가 된 시, 「솔아 솔아 푸른 솔아」
            </h4>
            <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 2.05; word-break: keep-all; margin-bottom: 24px;">
              1987년 박영근 시인의 두 번째 시집 『대열』에 수록된 「솔아 솔아 푸른 솔아」(부제: 백제 6)는 백창우 작곡, 안치환과 '노래를 찾는 사람들'의 노래로 널리 불리며 1980~90년대 민주화운동 현장과 광장에서 수천만 시민들의 가슴을 울렸습니다.<br>
              모진 샛바람 속에서도 꺾이지 않는 푸른 소나무의 기상은 절망 속에서도 꺼지지 않는 인간의 자유와 희망을 상징하며, 경기도 부천 솔안공원 시비에 시인의 친필로 각석되어 있습니다.
            </p>
            <div style="font-family: var(--font-serif); font-size: 1.02rem; color: var(--text-primary); line-height: 2.1; background: #ffffff; padding: 26px 30px; border: 1px solid var(--border-light); border-left: 4px solid var(--accent-pine); display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
              <div>
                부르네 물억새 마다 엉키던<br>
                아우의 피들 무심히 씻겨간<br>
                빈 나루터, 물이 풀려도<br>
                찢어진 무명베 곁에서 봄은 멀고<br>
                기다림은 철없이 꽃으로나 피는지<br>
                주저앉아 우는 누이들<br>
                옷고름 풀고 이름을 부르네.<br><br>
                솔아 솔아 푸른 솔아<br>
                샛바람에 떨지 마라<br>
                어널널 상사뒤<br>
                어여뒤여 상사뒤
              </div>
              <div>
                부르네, 장마비 울다 가는<br>
                삼년 묵정밭 드리는 호밋날마다<br>
                아우의 얼굴 끌려 나오고<br>
                늦바람이나 머물다 갔는지<br>
                수수가 익어도 서럽던 가을, 에미야<br>
                시월비 어두운 산허리 따라<br>
                넘치는 그리움으로 강물 저어가네.<br><br>
                만나겠네. 엉겅퀴 몹쓸 땅에<br>
                살아서 가다가 가다가<br>
                허기 들면 솔닢 씹다가<br>
                네가 묶인 곳, 아우야<br>
                창살 아래 또 한 세상이 묶여도<br>
                가겠네, 다시 만나겠네.
              </div>
            </div>
          </div>

        </div>
      `;

    // =========================================================================
    // 3. EXHIBITION & ARCHIVE (전시 & 아카이브)
    // =========================================================================
    case 'exhibition':
      return `
        <div style="width: 100%;">
          <div class="visual-gallery-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 36px;">
            
            <div class="visual-gallery-card" data-lightbox="assets/images/솔아문학예술관.png" data-caption="박영근 시인 상설 유품전 (1층 전시실)">
              <div class="visual-img-container" style="height: 240px;">
                <img src="assets/images/솔아문학예술관.png" alt="솔아문학예술관 전시실" onerror="this.src='assets/images/sola_building_facade.png'">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">PERMANENT EXHIBITION</div>
                <div class="visual-card-title">박영근 시인 상설전시실</div>
                <div class="visual-card-desc">1층 전시실 · 시인의 생애와 문학 세계 상설 전시</div>
              </div>
            </div>

            <div class="visual-gallery-card" data-lightbox="assets/images/솔아문학예술관.png" data-caption="박지현 갤러리 생태·현대미술 기획전 (2층)">
              <div class="visual-img-container" style="height: 240px;">
                <img src="assets/images/솔아문학예술관.png" alt="박지현 갤러리" onerror="this.src='assets/images/sola_building_facade.png'">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">GALLERY EXHIBITION</div>
                <div class="visual-card-title">박지현 갤러리 기획전</div>
                <div class="visual-card-desc">2층 갤러리 · 생태와 자연, 인간의 원형적 아름다움을 담은 현대미술전</div>
              </div>
            </div>

          </div>

          <!-- Exhibition Detail Blocks -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 28px;">
              <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 12px;">
                1층 문학관 전시 안내
              </h4>
              <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.8;">
                1984년 첫 시집 『취업공고판 앞에서』부터 2007년 유고시집까지 박영근 시인의 주요 저작들과 생애를 기리는 문학적 기록 및 실물 전시를 관람하실 수 있습니다.
              </p>
            </div>

            <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 28px;">
              <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 12px;">
                2층 갤러리 기획전 안내
              </h4>
              <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.8;">
                박지현 작가의 개념미술 20여 점과 함께<br>분기별 초대전 및 청년 작가 기획전이 상시 운영됩니다.
              </p>
            </div>
          </div>
        </div>
      `;

    case 'books':
    case 'poet-books': {
      const poetBooks = siteData.publications.filter(b => b.group === 'poet');
      return `
        <div style="width: 100%;">
          
          <!-- Curation Header: Poet Books -->
          <div style="border-left: 4px solid var(--accent-orange); padding: 22px 28px; background: var(--bg-subtle); margin-bottom: 28px;">
            <div style="font-family: var(--font-en); font-size: 0.8rem; font-weight: 700; color: var(--accent-gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">
              MAJOR WORKS COLLECTION
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 1.45rem; margin-bottom: 8px; color: var(--text-primary);">
              박영근 시인 주요 저작 컬렉션
            </h4>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.8; margin: 0; word-break: keep-all;">
              청사, 풀빛, 실천문학사, 창작과비평사(창비), 도서출판 강 등 대한민국 대표 문학 출판사에서 출간된 박영근 시인의 제1시집부터 유고시집, 정본 전집(시·산문), 추모시집 전권 컬렉션입니다.
            </p>
          </div>

          <!-- Quick Navigation Notice -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid var(--border-light); padding-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">
              박영근 시인 출간 도서 (${poetBooks.length}권)
            </div>
          </div>

          <div class="visual-gallery-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            ${poetBooks.map(b => renderBookCardHTML(b)).join('')}
          </div>

        </div>
      `;
    }

    case 'publications':
    case 'sola-books': {
      const solaBooks = siteData.publications.filter(b => b.group === 'sola');
      return `
        <div style="width: 100%;">
          
          <!-- Curation Header: Sol-a Literature -->
          <div style="border-left: 4px solid var(--accent-pine); padding: 22px 28px; background: var(--bg-subtle); margin-bottom: 28px;">
            <div style="font-family: var(--font-en); font-size: 0.8rem; font-weight: 700; color: var(--accent-pine); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">
              SOL-A LITERATURE &amp; RESEARCH PUBLICATIONS
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 1.45rem; margin-bottom: 8px; color: var(--text-primary);">
              계간 『솔아문학』 및 도서출판 솔아 출간물
            </h4>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.8; margin: 0; word-break: keep-all;">
              15년간 부안 변산에서 이어온 계간 『황야문학』의 지평을 잇고, 전국 단위 정통 문예지로 재창간된 계간 『솔아문학』과 박정근문학연구소 연구총서 등 솔아문학예술관 공식 발간 도서입니다.
            </p>
          </div>

          <!-- Quick Navigation Notice -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid var(--border-light); padding-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">
              솔아문학예술관 공식 출판물 (${solaBooks.length}종)
            </div>
            <a href="#poet/books" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; background: #ffffff; color: var(--accent-orange); border: 1.5px solid var(--accent-orange); font-weight: 700; font-size: 0.88rem; text-decoration: none; border-radius: 2px; transition: all 0.2s ease;" onmouseover="this.style.background='var(--accent-orange)'; this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff'; this.style.color='var(--accent-orange)';">
              <i class="fa-solid fa-book-bookmark"></i> 박영근 시인 주요 저서 컬렉션 보러가기 <i class="fa-solid fa-arrow-right" style="font-size: 0.78rem;"></i>
            </a>
          </div>

          <div class="visual-gallery-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 40px;">
            ${solaBooks.map(b => renderBookCardHTML(b)).join('')}
          </div>

          <!-- Sol-a Literature Subscription & Manuscript Callout Banner -->
          <div style="background: #ffffff; border: 1.5px solid var(--accent-gold); padding: 32px 36px; border-radius: 4px; display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 32px; align-items: center; box-shadow: var(--shadow-subtle);">
            <div>
              <div style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;">
                SOL-A LITERATURE MEMBERSHIP &amp; MANUSCRIPT
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 10px;">
                계간 『솔아문학』 정기구독 및 신작 원고 투고
              </h4>
              <p style="font-size: 0.94rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 0; word-break: keep-all;">
                계간 『솔아문학』은 시, 소설, 평론, 수필 등 당대 한국문학의 최전선에서<br>치열하게 사유하는 작가들의 신작을 상시 모집하며 정기구독 신청을 받고 있습니다.
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; justify-content: center;">
              <a href="mailto:sola_art@naver.com?subject=[계간 솔아문학 정기구독 신청]" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--text-primary); color: #ffffff; padding: 14px 20px; font-weight: 700; font-size: 0.95rem; text-decoration: none; border-radius: 2px; transition: all var(--tr-fast);" onmouseover="this.style.background='var(--accent-gold)';" onmouseout="this.style.background='var(--text-primary)';">
                <i class="fa-solid fa-envelope"></i> 정기구독 신청 (이메일)
              </a>
              <a href="mailto:sola_art@naver.com?subject=[계간 솔아문학 신작 원고 투고]" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #ffffff; color: var(--accent-pine); border: 1.5px solid var(--accent-pine); padding: 14px 20px; font-weight: 700; font-size: 0.95rem; text-decoration: none; border-radius: 2px; transition: all var(--tr-fast);" onmouseover="this.style.background='var(--accent-pine)'; this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff'; this.style.color='var(--accent-pine)';">
                <i class="fa-solid fa-feather"></i> 신작 원고 투고 및 게재 문의
              </a>
            </div>
          </div>

        </div>
      `;
    }

    case 'photo-archive':
      return `
        <div style="width: 100%;">
          <p style="font-size: 0.98rem; color: var(--text-secondary); margin-bottom: 30px; text-align: center;">
            사진을 클릭하시면 고화질 원본으로 크게 확대하여 감상하실 수 있습니다. (라이트박스 뷰어 지원)
          </p>

          <div class="visual-gallery-grid" style="grid-template-columns: repeat(2, 1fr);">
            
            <!-- 4. 박영근 시인 초상 (이미지 추후 교체 예정) -->
            <div class="visual-gallery-card" data-lightbox="assets/images/박영근.jpg" data-caption="박영근 시인 생전 모습 (1958~2006)">
              <div class="visual-img-container">
                <img src="assets/images/박영근.jpg" alt="박영근 시인">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">PORTRAIT</div>
                <div class="visual-card-title">박영근 시인 초상</div>
                <div class="visual-card-desc">한국 노동문학의 개척자 박영근</div>
              </div>
            </div>

            <!-- 5. 부천 박영근 시비 (이미지 추후 교체 예정) -->
            <div class="visual-gallery-card" data-lightbox="assets/images/박영근시비.jpg" data-caption="부천 박영근 친필 각석 시비">
              <div class="visual-img-container">
                <img src="assets/images/박영근시비.jpg" alt="부천 박영근 시비">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">MONUMENT</div>
                <div class="visual-card-title">부천 박영근 시비</div>
                <div class="visual-card-desc">경기도 부천에 건립된 친필 각석 시비</div>
              </div>
            </div>

            <!-- 3. 솔아문학 공식 심볼 (순서 변경: 3번째 위치) -->
            <div class="visual-gallery-card" data-lightbox="assets/images/솔아.png" data-caption="솔아문학예술 공식 엠블럼">
              <div class="visual-img-container" style="background: #ffffff;">
                <img src="assets/images/솔아.png" alt="솔아 엠블럼" style="object-fit: contain; padding: 20px;">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">IDENTITY</div>
                <div class="visual-card-title">솔아문학 공식 심볼</div>
                <div class="visual-card-desc">푸른 소나무와 붓을 형상화한 로고마크</div>
              </div>
            </div>

            <!-- 솔아문학예술관 본관 -->
            <div class="visual-gallery-card" data-lightbox="assets/images/솔아문학예술관.png" data-caption="솔아문학예술관 본관 외관 전경">
              <div class="visual-img-container">
                <img src="assets/images/솔아문학예술관.png" alt="문학관 전경" onerror="this.src='assets/images/sola_building_facade.png'">
                <span class="visual-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
              </div>
              <div class="visual-card-body">
                <div class="visual-card-tag">ARCHITECTURE</div>
                <div class="visual-card-title">솔아문학예술관 본관</div>
                <div class="visual-card-desc">전북특별자치도 부안군 변산면 산기길 10</div>
              </div>
            </div>

          </div>
        </div>
      `;

    // =========================================================================
    // 4. COMMUNITY & SUPPORT (소식 & 참여)
    // =========================================================================
    case 'notices':
      return `
        <div style="width: 100%;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${siteData.notices.map(n => `
              <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 26px; display: flex; justify-content: space-between; align-items: center; gap: 20px; transition: all var(--tr-fast); cursor: pointer;" onmouseover="this.style.borderColor='var(--text-primary)'; this.style.boxShadow='var(--shadow-subtle)'" onmouseout="this.style.borderColor='var(--border-light)'; this.style.boxShadow='none'">
                <div>
                  <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                    <span style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 700; color: var(--accent-orange); background: var(--bg-subtle); padding: 3px 10px; border: 1px solid var(--border-light);">${n.category}</span>
                    <span style="font-family: var(--font-en); font-size: 0.85rem; color: var(--text-muted);">${n.date}</span>
                  </div>
                  <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-primary); margin: 0;">${n.title}</h4>
                </div>
                <i class="fa-solid fa-chevron-right" style="color: var(--text-muted);"></i>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'research-cafe':
      return `
        <div style="width: 100%;">
          
          <!-- Hero Banner for Research Cafe -->
          <div style="border: 1px solid var(--border-light); background: var(--bg-subtle); padding: 48px 40px; margin-bottom: 36px; position: relative;">
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
              <span style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 800; color: #03C75A; background: #e8f9ee; padding: 4px 10px; border-radius: 2px; letter-spacing: 0.1em; display: inline-flex; align-items: center; gap: 6px;">
                <span style="font-weight: 900; font-size: 0.88rem;">N</span> NAVER CAFE
              </span>
              <span style="font-family: var(--font-en); font-size: 0.78rem; font-weight: 700; color: var(--accent-gold); letter-spacing: 0.12em; text-transform: uppercase;">
                OPEN RESEARCH &amp; LITERATURE COMMUNITY
              </span>
            </div>

            <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--text-primary); margin-bottom: 16px;">
              솔아 문학·연구 커뮤니티 (네이버 카페)
            </h3>

            <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.85; max-width: 780px; margin-bottom: 24px; word-break: keep-all;">
              본 카페는 기존의 박영근 추모 모임과 달리, <strong>박영근 시인의 시학·문학사 연구 성과를 실시간으로 기록·축적</strong>하고, <strong>계간 『솔아문학』의 신작과 문학적 담론을 작가·연구자·독자가 함께 나누는 열린 학술·창작 소통 광장</strong>입니다.
            </p>

            <!-- Action Button: Open Naver Cafe -->
            <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
              <a href="https://cafe.naver.com/solapark" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 10px; background: #03C75A; color: #ffffff; padding: 14px 28px; font-weight: 700; font-size: 0.98rem; text-decoration: none; border-radius: 2px; transition: all var(--tr-fast); box-shadow: 0 4px 14px rgba(3,199,90,0.28);" onmouseover="this.style.background='#02b150';" onmouseout="this.style.background='#03C75A';">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> 네이버 카페 바로가기 (cafe.naver.com/solapark)
              </a>
              <span style="font-size: 0.88rem; color: var(--text-muted);">
                <i class="fa-solid fa-check" style="color: #03C75A; margin-right: 4px;"></i> 누구나 자유롭게 가입하여 연구 논고와 문학 글을 공유하실 수 있습니다.
              </span>
            </div>
          </div>

          <!-- Feature Cards Grid (3 Columns) -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 36px;">
            
            <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 28px; display: flex; flex-direction: column;">
              <div style="width: 44px; height: 44px; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent-orange); font-size: 1.2rem; margin-bottom: 16px; border: 1px solid var(--border-light);">
                <i class="fa-solid fa-book-open-reader"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 10px;">
                박영근 시학 실시간 연구
              </h4>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0; word-break: keep-all;">
                박영근문학연구소와 함께 시인의 텍스트 비평, 부안 변산 서정 연구, 시대정신과 문학사적 연구 논고를 실시간으로 올리고 공유합니다.
              </p>
            </div>

            <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 28px; display: flex; flex-direction: column;">
              <div style="width: 44px; height: 44px; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent-pine); font-size: 1.2rem; margin-bottom: 16px; border: 1px solid var(--border-light);">
                <i class="fa-solid fa-feather-pointed"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 10px;">
                계간 『솔아문학』 담론장
              </h4>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0; word-break: keep-all;">
                계간 『솔아문학』의 발간 소식과 신작 수록작 토론, 필진과 독자가 함께 소통하는 생생한 문학 현장의 목소리를 담습니다.
              </p>
            </div>

            <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 28px; display: flex; flex-direction: column;">
              <div style="width: 44px; height: 44px; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); font-size: 1.2rem; margin-bottom: 16px; border: 1px solid var(--border-light);">
                <i class="fa-solid fa-users-line"></i>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 10px;">
                작가 및 시민 참여 연대
              </h4>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0; word-break: keep-all;">
                문학관 행사 후기, 문학 기행 기록, 청년 작가 및 회원들의 창작시와 문화예술 비평을 상시 게재하고 소통합니다.
              </p>
            </div>

          </div>

        </div>
      `;

    case 'donation':
      return `
        <div style="width: 100%;">
          <div style="border: 1px solid var(--border-light); background: var(--bg-subtle); padding: 50px 40px; text-align: center; margin-bottom: 36px;">
            <div style="font-family: var(--font-en); font-size: 0.85rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.18em; margin-bottom: 8px;">
              SOLA FOUNDATION MEMBERSHIP
            </div>
            <h3 style="font-family: var(--font-serif); font-size: 1.9rem; color: var(--text-primary); margin-bottom: 16px;">
              솔아문학예술 후원회 안내
            </h3>
            <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 1.9; max-width: 660px; margin: 0 auto 30px auto; word-break: keep-all;">
              박영근 시인의 얼을 기리고, 계간 『솔아문학』의 정기 발간과<br>신진 작가들의 창작을 지원하는 아름다운 동행에 함께해 주세요.
            </p>

            <div style="background: #ffffff; border: 1px solid var(--border-light); padding: 32px; max-width: 520px; margin: 0 auto;">
              <div style="font-family: var(--font-en); font-size: 0.82rem; font-weight: 700; color: var(--accent-orange); margin-bottom: 8px;">
                OFFICIAL DONATION ACCOUNT
              </div>
              <div style="font-family: var(--font-en); font-size: 1.9rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
                카카오뱅크 3333-3792-13817
              </div>
              <div style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 20px;">
                예금주 : 박정근 (솔아문학예술 대표)
              </div>
              <button class="btn-bank-copy" onclick="window.copyAccountToClipboard()" style="font-size: 0.9rem; padding: 12px 28px;">
                <i class="fa-solid fa-copy"></i> 계좌번호 복사하기
              </button>
            </div>
          </div>
        </div>
      `;

    default:
      return `<div style="text-align: center; padding: 60px 0; color: var(--text-muted);">콘텐츠를 불러오는 중입니다...</div>`;
  }
}

// Subpage Interactive Handlers
function attachSubpageInteractiveHandlers(main, sub) {
  // Lightbox Click Listeners on All Visual Cards
  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.lightbox;
      const caption = card.dataset.caption || '';
      openLightbox(src, caption);
    });
  });

  // Dedicated Poem Handler for #poet/poems
  if (sub === 'poems') {
    const itemsBox = document.getElementById('subpage-poem-items');
    const stageBox = document.getElementById('subpage-poem-stage');
    
    function renderSubpageSelectedPoem(idx) {
      const p = siteData.tenPoems[idx];
      if (!p || !stageBox) return;

      stageBox.innerHTML = `
        <div class="poetry-header-block">
          <div class="poetry-category-badge">POEM NO. ${p.number} · ${p.hanja}</div>
          <h3 class="poetry-title-large">${p.title}</h3>
          <div class="poetry-meta-pill-row">
            <span class="poetry-meta-pill"><i class="fa-solid fa-book-bookmark"></i> ${p.book}</span>
            <span class="poetry-meta-pill"><i class="fa-solid fa-tag"></i> 박영근 대표시 10선</span>
          </div>
          <div class="poetry-callout-quote">
            “${p.quote}”
          </div>
        </div>

        <div class="poetry-columns-grid">
          <div class="poetry-text-col">
            <div style="font-family: var(--font-en); font-size: 0.78rem; letter-spacing: 0.18em; color: var(--text-muted); margin-bottom: 20px;">
              POETRY VERSES
            </div>
            ${escapeHTML(p.excerpt)}
          </div>

          <div class="poetry-curation-col">
            <div class="curation-note-box">
              <div class="curation-note-title"><i class="fa-solid fa-compass"></i> 테마 및 주제</div>
              <div class="curation-note-desc" style="font-weight: 600; color: var(--text-primary);">${p.theme}</div>
            </div>

            <div class="curation-note-box">
              <div class="curation-note-title"><i class="fa-solid fa-feather"></i> 작품 심층 해설</div>
              <div class="curation-note-desc">${p.commentary}</div>
            </div>

            <div class="curation-note-box">
              <div class="curation-note-title"><i class="fa-solid fa-monument"></i> 문학사적 의의</div>
              <div class="curation-note-desc">${p.significance}</div>
            </div>

            ${p.buyUrl ? `
              <div style="margin-top: 14px;">
                <a href="${p.buyUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 16px; background: #ffffff; border: 1.5px solid var(--accent-orange); color: var(--accent-orange); font-weight: 700; font-size: 0.88rem; text-decoration: none; transition: all var(--tr-fast); box-shadow: var(--shadow-subtle);" onmouseover="this.style.background='var(--accent-orange)';this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff';this.style.color='var(--accent-orange)';">
                  <i class="fa-solid fa-cart-shopping"></i> ${p.buyLabel || '도서 바로가기 / 검색'} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem;"></i>
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    if (itemsBox) {
      itemsBox.querySelectorAll('.poetry-menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.poemIndex);
          itemsBox.querySelectorAll('.poetry-menu-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderSubpageSelectedPoem(idx);
        });
      });
    }

    renderSubpageSelectedPoem(0);
  }
}

// ==========================================================================
// LIGHTBOX & MODALS & SEARCH
// ==========================================================================
function openLightbox(src, caption) {
  if (!elements.modalLightbox) return;
  elements.lightboxImg.src = src;
  elements.lightboxCaption.textContent = caption;
  elements.modalLightbox.classList.add('open');
}

function closeLightbox() {
  if (!elements.modalLightbox) return;
  elements.modalLightbox.classList.remove('open');
}

function setupEventListeners() {
  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('popstate', handleRouting);

  // Logo Click
  const logoBtn = document.getElementById('brand-logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });
  }

  // Header Nav Links & Dropdowns
  document.querySelectorAll('.nav-link, .dropdown-link, .footer-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetPath = href.replace('#', '');
        navigateTo(targetPath);
        
        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        if (navMenu && navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
        }
      }
    });
  });

  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById('btn-mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Hero Buttons
  const btnExplore = document.getElementById('hero-btn-explore');
  if (btnExplore) btnExplore.addEventListener('click', () => navigateTo('about/greeting'));

  const btnMemorial = document.getElementById('hero-btn-memorial');
  if (btnMemorial) btnMemorial.addEventListener('click', () => navigateTo('poet/poems'));

  const btnSubmit = document.getElementById('hero-btn-submit');
  if (btnSubmit) btnSubmit.addEventListener('click', () => navigateTo('community/submission'));

  // Home Banner Donate Buttons
  const btnBannerDonate = document.getElementById('btn-banner-donate');
  if (btnBannerDonate) btnBannerDonate.addEventListener('click', () => navigateTo('community/donation'));

  const btnQuickCopy = document.getElementById('btn-quick-copy');
  if (btnQuickCopy) btnQuickCopy.addEventListener('click', copyAccountToClipboard);

  // Home 4 Pillars
  document.querySelectorAll('.museum-pillar-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      if (target) navigateTo(target);
    });
  });

  // Generic data-target click listeners
  document.querySelectorAll('[data-target]').forEach(elem => {
    elem.addEventListener('click', () => {
      const target = elem.dataset.target;
      if (target) navigateTo(target);
    });
  });

  // Modals Open/Close
  const btnOpenSearch = document.getElementById('btn-open-search');
  const btnCloseSearch = document.getElementById('btn-close-search');
  if (btnOpenSearch && elements.modalSearch) {
    btnOpenSearch.addEventListener('click', () => {
      elements.modalSearch.classList.add('open');
      if (elements.searchInput) elements.searchInput.focus();
    });
  }
  if (btnCloseSearch && elements.modalSearch) {
    btnCloseSearch.addEventListener('click', () => elements.modalSearch.classList.remove('open'));
  }

  const btnOpenDonation = document.getElementById('btn-open-donation');
  const btnCloseDonation = document.getElementById('btn-close-donation');
  if (btnOpenDonation && elements.modalDonation) {
    btnOpenDonation.addEventListener('click', () => elements.modalDonation.classList.add('open'));
  }
  if (btnCloseDonation && elements.modalDonation) {
    btnCloseDonation.addEventListener('click', () => elements.modalDonation.classList.remove('open'));
  }

  // Lightbox Close
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');
  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener('click', closeLightbox);
  }
  if (elements.modalLightbox) {
    elements.modalLightbox.addEventListener('click', (e) => {
      if (e.target === elements.modalLightbox) closeLightbox();
    });
  }

  // Account Copy Buttons
  const footerBtnCopy = document.getElementById('footer-btn-copy');
  if (footerBtnCopy) footerBtnCopy.addEventListener('click', copyAccountToClipboard);

  const modalBtnCopy = document.getElementById('modal-btn-copy');
  if (modalBtnCopy) modalBtnCopy.addEventListener('click', copyAccountToClipboard);

  // Search Live Filter
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value.trim());
    });
  }
}

function copyAccountToClipboard() {
  const accountNum = "3333-3792-13817";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(accountNum).then(() => {
      showToast("후원 계좌번호가 복사되었습니다. (카카오뱅크 3333-3792-13817 / 예금주: 박정근)");
    }).catch(() => {
      showToast("후원 계좌: 카카오뱅크 3333-3792-13817 (예금주: 박정근)");
    });
  } else {
    showToast("후원 계좌: 카카오뱅크 3333-3792-13817 (예금주: 박정근)");
  }
}
window.copyAccountToClipboard = copyAccountToClipboard;

function handleSubmissionSubmit() {
  const author = document.getElementById('sub-author')?.value || '작가';
  const title = document.getElementById('sub-title')?.value || '작품';
  showToast(`[접수 완료] ${author} 작가님의 『${title}』 원고가 성공적으로 접수되었습니다.`);
  const form = document.getElementById('online-submit-form');
  if (form) form.reset();
}
window.handleSubmissionSubmit = handleSubmissionSubmit;

function showToast(msg) {
  if (!elements.toast) return;
  elements.toast.textContent = msg;
  elements.toast.style.transform = 'translateX(-50%) translateY(0)';
  elements.toast.style.opacity = '1';
  setTimeout(() => {
    elements.toast.style.transform = 'translateX(-50%) translateY(100px)';
    elements.toast.style.opacity = '0';
  }, 3500);
}

function performSearch(query) {
  if (!elements.searchResultsBox) return;
  if (!query) {
    elements.searchResultsBox.innerHTML = `
      <p style="font-size: 0.9rem; color: var(--text-muted); text-align: center; padding: 40px 0;">
        검색어를 입력하면 실시간으로 아카이브를 검색합니다.
      </p>
    `;
    return;
  }

  const results = [];
  const q = query.toLowerCase();

  // Search Poems
  siteData.tenPoems.forEach((p) => {
    if (p.title.toLowerCase().includes(q) || p.quote.toLowerCase().includes(q) || p.theme.toLowerCase().includes(q)) {
      results.push({
        type: '대표시 10선',
        title: p.title,
        desc: p.quote,
        link: 'poet/poems'
      });
    }
  });

  // Search Notices
  siteData.notices.forEach(n => {
    if (n.title.toLowerCase().includes(q)) {
      results.push({
        type: '공지사항',
        title: n.title,
        desc: `${n.category} · ${n.date}`,
        link: 'community/notices'
      });
    }
  });

  // Search Publications
  siteData.publications.forEach(b => {
    if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
      results.push({
        type: '도서·출판',
        title: b.title,
        desc: `${b.author} · ${b.desc}`,
        link: 'archive/publications'
      });
    }
  });

  if (results.length === 0) {
    elements.searchResultsBox.innerHTML = `
      <p style="font-size: 0.9rem; color: var(--text-muted); text-align: center; padding: 40px 0;">
        '${escapeHTML(query)}' 에 대한 검색 결과가 없습니다.
      </p>
    `;
    return;
  }

  elements.searchResultsBox.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 12px 0;">
      ${results.map(r => `
        <div style="padding: 16px; border: 1px solid var(--border-light); background: #ffffff; cursor: pointer; transition: all var(--tr-fast);" onclick="window.location.hash='${r.link}'; document.getElementById('modal-search').classList.remove('open');">
          <span style="font-family: var(--font-en); font-size: 0.72rem; font-weight: 700; color: var(--accent-orange); text-transform: uppercase;">${r.type}</span>
          <div style="font-family: var(--font-serif); font-weight: 700; font-size: 1.05rem; color: var(--text-primary); margin: 2px 0 4px 0;">${r.title}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">${r.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/\n/g, '<br>');
}

window.copyEmailAddress = function(btn) {
  const email = 'sola_art@naver.com';
  
  function showSuccess() {
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    const originalBg = btn.style.backgroundColor;
    const originalColor = btn.style.color;
    
    btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 8px;"></i> sola_art@naver.com 복사 완료!';
    btn.style.backgroundColor = '#1b4332';
    btn.style.color = '#ffffff';

    let toast = document.getElementById('sola-copy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sola-copy-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '32px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
      toast.style.color = '#ffffff';
      toast.style.padding = '14px 28px';
      toast.style.borderRadius = '30px';
      toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
      toast.style.fontSize = '0.95rem';
      toast.style.fontWeight = '600';
      toast.style.zIndex = '99999';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '10px';
      toast.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i> sola_art@naver.com 주소가 클립보드에 복사되었습니다.';
    toast.style.opacity = '1';
    toast.style.visibility = 'visible';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.backgroundColor = originalBg;
      btn.style.color = originalColor;
    }, 2200);

    setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }
    }, 2200);
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showSuccess).catch(() => {
      fallbackCopy(email);
      showSuccess();
    });
  } else {
    fallbackCopy(email);
    showSuccess();
  }
};

// Ensure initApp executes reliably whether loading or already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
