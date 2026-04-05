(function() {
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    const loadingOverlay = document.getElementById('loadingOverlay');
    const homeCard = document.getElementById('homeCard');
    let animating = false;

    function setFullHeight() {
        const winHeight = window.innerHeight;
        document.documentElement.style.height = winHeight + 'px';
        document.body.style.height = winHeight + 'px';
        if (homeCard) {
            homeCard.style.minHeight = winHeight + 'px';
        }
    }

    function waitForImages() {
        return new Promise((resolve) => {
            const images = document.querySelectorAll('img');
            if (images.length === 0) {
                resolve();
                return;
            }
            let loadedCount = 0;
            let totalImages = images.length;
            let resolved = false;

            function onImageLoad() {
                loadedCount++;
                if (!resolved && loadedCount === totalImages) {
                    resolved = true;
                    resolve();
                }
            }

            images.forEach(img => {
                if (img.complete && img.naturalWidth !== 0) {
                    onImageLoad();
                } else {
                    img.addEventListener('load', onImageLoad);
                    img.addEventListener('error', onImageLoad);
                }
            });

            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, 5000);
        });
    }

    const startTime = Date.now();
    Promise.all([waitForImages(), new Promise(resolve => setTimeout(resolve, 1000))]).then(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                homeCard.classList.add('slide-in');
                fixLayoutAfterLoad();
            }, 400);
        }, remaining);
    });

    function fixLayoutAfterLoad() {
        setFullHeight();
        updateMusicBarPosition();
        if (window.dispatchEvent) {
            window.dispatchEvent(new Event('resize'));
        }
        const mainEl = document.querySelector('.main');
        if (mainEl) mainEl.style.minHeight = 'auto';
    }

    const notificationTrigger = document.getElementById('notification-trigger');
    const sidebar = document.querySelector('.sidebar');
    const notificationContent = document.querySelector('.sidebar-content');

    notificationTrigger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !notificationTrigger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    fetch('/text/notify/lately.txt')
        .then(res => res.text())
        .then(text => {
            notificationContent.innerHTML = `<h3 style="margin-bottom: 1rem; font-size: 1.4rem;">通知</h3><div style="white-space: pre-wrap;">${text}</div>`;
        })
        .catch(() => {
            notificationContent.innerHTML = `<h3 style="margin-bottom: 1rem; font-size: 1.4rem;">通知</h3><div>暂无通知</div>`;
        });

    const musicTrigger = document.getElementById('music-trigger');
    const musicBar = document.getElementById('musicBar');
    const musicClose = document.querySelector('.music-close');
    const musicPrev = document.querySelector('.music-prev');
    const musicNext = document.querySelector('.music-next');
    const audioPlayer = document.getElementById('audio-player');
    const musicInfo = document.querySelector('.music-info');

    let musicList = [];
    let currentMusicIndex = 0;
    let musicLoaded = false;

    async function loadMusicList() {
        try {
            const response = await fetch('/text/list/playlist.txt');
            if (!response.ok) throw new Error();
            const text = await response.text();
            const lines = text.split(/\r?\n/);
            musicList = [];
            for (let line of lines) {
                line = line.trim();
                if (line === '') continue;
                const eqIndex = line.indexOf('=');
                if (eqIndex === -1) continue;
                const titlePart = line.substring(0, eqIndex).trim();
                const filename = line.substring(eqIndex + 1).trim();
                musicList.push({
                    src: `/audio/music/${filename}`,
                    title: titlePart
                });
            }
            if (musicList.length > 0) {
                loadMusic(0, false);
            }
        } catch (err) {
            console.error('加载音乐列表失败', err);
        }
    }

    function loadMusic(index, autoPlay = true) {
        if (!musicList.length) return;
        const music = musicList[index];
        if (audioPlayer.src === music.src && !audioPlayer.paused) return;
        audioPlayer.src = music.src;
        musicInfo.textContent = music.title;
        if (autoPlay) {
            audioPlayer.play().catch(() => {});
        }
        musicLoaded = true;
    }

    function updateMusicBarPosition() {
        const header = document.querySelector('.header');
        if (header && musicBar) {
            const headerHeight = header.offsetHeight;
            musicBar.style.top = headerHeight + 'px';
        }
    }

    let ticking = false;
    function onScrollOrResize() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateMusicBarPosition();
                ticking = false;
            });
            ticking = true;
        }
    }

    musicTrigger.addEventListener('click', () => {
        musicBar.classList.toggle('active');
        if (musicBar.classList.contains('active')) {
            updateMusicBarPosition();
            if (!musicLoaded && !audioPlayer.src) {
                if (musicList.length) loadMusic(currentMusicIndex, true);
            } else if (audioPlayer.src && audioPlayer.paused) {
                audioPlayer.play().catch(() => {});
            }
        } else {
            audioPlayer.pause();
        }
    });

    musicClose.addEventListener('click', () => {
        musicBar.classList.remove('active');
        audioPlayer.pause();
    });

    musicPrev.addEventListener('click', () => {
        if (!musicList.length) return;
        currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
        loadMusic(currentMusicIndex, true);
        if (!musicBar.classList.contains('active')) {
            musicBar.classList.add('active');
            updateMusicBarPosition();
        }
    });

    musicNext.addEventListener('click', () => {
        if (!musicList.length) return;
        currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
        loadMusic(currentMusicIndex, true);
        if (!musicBar.classList.contains('active')) {
            musicBar.classList.add('active');
            updateMusicBarPosition();
        }
    });

    const searchInput = document.getElementById('search-input');
    const searchBox = document.getElementById('search-box');

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            document.body.classList.add('search-focused');
            searchBox.classList.add('focused');
        });
        searchInput.addEventListener('blur', () => {
            document.body.classList.remove('search-focused');
            searchBox.classList.remove('focused');
        });
    }

    const carouselContainer = document.querySelector('.carousel-container');
    let carousel = document.getElementById('carousel');
    const originalItems = Array.from(carousel.querySelectorAll('.carousel-item'));
    let totalItems = originalItems.length;
    let currentIndex = 1;
    let autoPlayInterval;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchStartY = 0;

    function initInfiniteCarousel() {
        const firstClone = originalItems[0].cloneNode(true);
        const lastClone = originalItems[totalItems - 1].cloneNode(true);
        carousel.appendChild(firstClone);
        carousel.insertBefore(lastClone, originalItems[0]);
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        carousel.style.transition = 'transform 0.3s ease';
        totalItems += 2;
        const indicatorsContainer = document.getElementById('carousel-indicators');
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < originalItems.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'indicator';
            dot.dataset.index = i;
            indicatorsContainer.appendChild(dot);
        }
        const newIndicators = document.querySelectorAll('.indicator');
        newIndicators.forEach((ind, idx) => {
            ind.addEventListener('click', () => {
                if (isTransitioning) return;
                currentIndex = idx + 1;
                updateCarousel(true);
                resetAutoPlay();
            });
        });
        updateIndicators();
    }

    function updateCarousel(useTransition = true) {
        if (!useTransition) {
            carousel.style.transition = 'none';
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.offsetHeight;
            carousel.style.transition = 'transform 0.3s ease';
        } else {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        updateIndicators();
    }

    function updateIndicators() {
        const realIndex = (currentIndex - 1 + originalItems.length) % originalItems.length;
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === realIndex);
        });
    }

    function handleTransitionEnd() {
        isTransitioning = false;
        if (currentIndex === 0) {
            currentIndex = originalItems.length;
            carousel.style.transition = 'none';
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.offsetHeight;
            carousel.style.transition = 'transform 0.3s ease';
        } else if (currentIndex === totalItems - 1) {
            currentIndex = 1;
            carousel.style.transition = 'none';
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.offsetHeight;
            carousel.style.transition = 'transform 0.3s ease';
        }
        updateIndicators();
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateCarousel(true);
        }, 3000);
    }

    function resetAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    }

    carousel.addEventListener('transitionend', handleTransitionEnd);

    carouselContainer.addEventListener('wheel', (e) => {
        const deltaX = Math.abs(e.deltaX);
        const deltaY = Math.abs(e.deltaY);
        if (deltaX > deltaY) {
            e.preventDefault();
            if (isTransitioning) return;
            isTransitioning = true;
            if (e.deltaX > 0) {
                currentIndex++;
            } else if (e.deltaX < 0) {
                currentIndex--;
            }
            updateCarousel(true);
            resetAutoPlay();
        }
    });

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    carouselContainer.addEventListener('touchmove', (e) => {
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    carouselContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - touchStartX;
        if (Math.abs(diffX) > 50) {
            if (isTransitioning) return;
            isTransitioning = true;
            if (diffX > 0) {
                currentIndex--;
            } else {
                currentIndex++;
            }
            updateCarousel(true);
            resetAutoPlay();
        }
    });

    let mouseStartX = 0;
    let isMouseDragging = false;

    carouselContainer.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        isMouseDragging = true;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isMouseDragging) return;
        const endX = e.clientX;
        const diffX = endX - mouseStartX;
        if (Math.abs(diffX) > 50) {
            if (isTransitioning) return;
            isTransitioning = true;
            if (diffX > 0) {
                currentIndex--;
            } else {
                currentIndex++;
            }
            updateCarousel(true);
            resetAutoPlay();
        }
        isMouseDragging = false;
    });

    initInfiniteCarousel();
    startAutoPlay();

    const allLinks = document.querySelectorAll('a');
    let transitionHandler = null;
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;
            if (this.target === '_blank') return;
            e.preventDefault();
            if (animating) return;
            animating = true;
            homeCard.classList.add('exit-left');
            if (transitionHandler) {
                homeCard.removeEventListener('transitionend', transitionHandler);
            }
            transitionHandler = function() {
                window.location.href = href;
            };
            homeCard.addEventListener('transitionend', transitionHandler, { once: true });
        });
    });

    const userIcon = document.getElementById('userIcon');
    const loginBtn = document.getElementById('loginBtn');
    const loginTextSpan = document.getElementById('loginText');

    async function fetchNickname(cookieValue) {
        try {
            const response = await fetch('/text/username.txt');
            if (!response.ok) throw new Error();
            const text = await response.text();
            const lines = text.split(/\r?\n/);
            for (let line of lines) {
                line = line.trim();
                if (line === '' || line.startsWith('#')) continue;
                const eqIndex = line.indexOf('=');
                if (eqIndex === -1) continue;
                const key = line.substring(0, eqIndex).trim();
                const value = line.substring(eqIndex + 1).trim();
                if (key === cookieValue) {
                    return value;
                }
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    function updateUserIconAndText() {
        const userCookie = getCookie('user');
        if (userCookie && userCookie !== '0') {
            userIcon.classList.remove('unlogged');
            userIcon.classList.add('avatar');
            userIcon.style.backgroundImage = `url('/image/avatar/${encodeURIComponent(userCookie)}.png')`;
            fetchNickname(userCookie).then(nickname => {
                if (nickname) {
                    loginTextSpan.textContent = nickname;
                } else {
                    loginTextSpan.textContent = userCookie;
                }
            }).catch(() => {
                loginTextSpan.textContent = userCookie;
            });
        } else {
            userIcon.classList.remove('avatar');
            userIcon.classList.add('unlogged');
            userIcon.style.backgroundImage = '';
            loginTextSpan.textContent = '登录';
        }
    }
    updateUserIconAndText();

    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener('click', () => {
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal-search';
            modalDiv.innerHTML = `
                <div class="modal-search-content">
                    <input type="text" class="modal-search-input" placeholder="搜索" id="modal-search-input">
                    <div class="modal-search-close">
                        <button id="modal-close-btn">取消</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalDiv);
            document.body.classList.add('search-focused');
            setTimeout(() => modalDiv.classList.add('show'), 10);
            const modalInput = document.getElementById('modal-search-input');
            if (modalInput) {
                modalInput.focus();
                bindSearchInput(modalInput);
            }
            const closeModal = () => {
                document.body.classList.remove('search-focused');
                modalDiv.classList.remove('show');
                setTimeout(() => modalDiv.remove(), 200);
            };
            document.getElementById('modal-close-btn').addEventListener('click', closeModal);
            modalDiv.addEventListener('click', (e) => {
                if (e.target === modalDiv) closeModal();
            });
        });
    }

    audioPlayer.addEventListener('ended', () => {
        const isActive = musicBar.classList.contains('active');
        if (musicList.length) {
            currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
            loadMusic(currentMusicIndex, isActive);
        }
    });

    function throwElement(element, isText = false) {
        const rect = element.getBoundingClientRect();
        const flyer = document.createElement('div');
        flyer.textContent = isText ? element.dataset.comment : '❤️';
        flyer.style.position = 'fixed';
        flyer.style.left = rect.left + rect.width / 2 + 'px';
        flyer.style.top = rect.top + rect.height / 2 + 'px';
        flyer.style.fontSize = '24px';
        flyer.style.pointerEvents = 'none';
        flyer.style.zIndex = '9999';
        flyer.style.transition = 'all 1.2s ease-out';
        const randomX = (Math.random() - 0.5) * 100;
        const randomRotate = (Math.random() - 0.5) * 60;
        document.body.appendChild(flyer);
        requestAnimationFrame(() => {
            flyer.style.transform = `translate(${randomX}px, -150px) rotate(${randomRotate}deg)`;
            flyer.style.opacity = '0';
        });
        setTimeout(() => flyer.remove(), 1200);
    }

    const heartIcon = document.querySelector('.icon-heart');
    const chatIcon = document.querySelector('.icon-chat');
    const starIcon = document.querySelector('.icon-star');

    if (heartIcon) {
        heartIcon.addEventListener('click', () => {
            throwElement(heartIcon);
        });
    }

    if (chatIcon) {
        let commentsCache = [];
        fetch('/text/comment.txt')
            .then(res => res.text())
            .then(text => {
                commentsCache = text.split(/\r?\n/).filter(line => line.trim().length > 0);
            })
            .catch(() => {
                commentsCache = ['默认评论'];
            });
        chatIcon.addEventListener('click', async () => {
            if (commentsCache.length === 0) {
                try {
                    const res = await fetch('/text/comment.txt');
                    const text = await res.text();
                    commentsCache = text.split(/\r?\n/).filter(line => line.trim().length > 0);
                } catch(e) {}
            }
            const randomComment = commentsCache.length ? commentsCache[Math.floor(Math.random() * commentsCache.length)] : '默认评论';
            const flyer = document.createElement('div');
            const rect = chatIcon.getBoundingClientRect();
            flyer.textContent = randomComment;
            flyer.style.position = 'fixed';
            flyer.style.left = rect.left + rect.width / 2 + 'px';
            flyer.style.top = rect.top + rect.height / 2 + 'px';
            flyer.style.fontSize = '16px';
            flyer.style.backgroundColor = 'rgba(0,0,0,0.7)';
            flyer.style.color = 'white';
            flyer.style.padding = '4px 8px';
            flyer.style.borderRadius = '20px';
            flyer.style.whiteSpace = 'nowrap';
            flyer.style.pointerEvents = 'none';
            flyer.style.zIndex = '9999';
            flyer.style.transition = 'all 1.2s ease-out';
            const randomX = (Math.random() - 0.5) * 80;
            const randomRotate = (Math.random() - 0.5) * 40;
            document.body.appendChild(flyer);
            requestAnimationFrame(() => {
                flyer.style.transform = `translate(${randomX}px, -120px) rotate(${randomRotate}deg)`;
                flyer.style.opacity = '0';
            });
            setTimeout(() => flyer.remove(), 1200);
        });
    }

    if (starIcon) {
        starIcon.addEventListener('click', () => {
            const homepageUrl = window.location.origin + '/place/home.html';
            if (window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(document.title, homepageUrl, '');
            } else if (window.external && window.external.AddFavorite) {
                window.external.AddFavorite(homepageUrl, document.title);
            } else {
                alert('请按 Ctrl+D 手动添加书签');
            }
        });
    }

    loadMusicList();

    let searchIndexMap = null;
    let searchResultsContainer = null;
    let currentImageModal = null;
    let searchDebounceTimer = null;

    function initSearchResultsContainer() {
        if (searchResultsContainer) return;
        const mainEl = document.querySelector('.main');
        if (!mainEl) return;
        let existing = document.getElementById('searchResultsContainer');
        if (existing) {
            searchResultsContainer = existing;
            return;
        }
        const container = document.createElement('div');
        container.id = 'searchResultsContainer';
        container.className = 'search-results-container';
        container.style.display = 'none';
        mainEl.appendChild(container);
        searchResultsContainer = container;
    }

    async function loadSearchIndex() {
        if (searchIndexMap) return searchIndexMap;
        try {
            const response = await fetch('/text/search.txt');
            if (!response.ok) throw new Error();
            const text = await response.text();
            const lines = text.split(/\r?\n/);
            const map = new Map();
            for (let line of lines) {
                line = line.trim();
                if (line === '') continue;
                const eqIndex = line.indexOf('=');
                if (eqIndex === -1) continue;
                const keyword = line.substring(0, eqIndex).trim();
                const urlsPart = line.substring(eqIndex + 1).trim();
                if (keyword && urlsPart) {
                    const urls = urlsPart.split('&').filter(u => u.trim().length > 0);
                    map.set(keyword, urls);
                }
            }
            searchIndexMap = map;
            return map;
        } catch (err) {
            console.error('加载搜索索引失败', err);
            return new Map();
        }
    }

    function renderImageGrid(urls, keyword) {
        if (!searchResultsContainer) initSearchResultsContainer();
        if (!searchResultsContainer) return;
        const container = searchResultsContainer;
        container.innerHTML = '';
        const closeDiv = document.createElement('div');
        closeDiv.className = 'search-close-btn';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.addEventListener('click', () => {
            hideSearchResults();
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            const modalInput = document.getElementById('modal-search-input');
            if (modalInput) modalInput.value = '';
        });
        closeDiv.appendChild(closeBtn);
        container.appendChild(closeDiv);
        const gridDiv = document.createElement('div');
        gridDiv.className = 'search-results-grid';
        if (!urls || urls.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'search-result-empty';
            emptyMsg.textContent = '未找到相关图片';
            gridDiv.appendChild(emptyMsg);
        } else {
            urls.forEach(url => {
                const card = document.createElement('div');
                card.className = 'search-result-card';
                const img = document.createElement('img');
                img.className = 'search-result-img';
                img.src = url;
                img.alt = keyword || '图片';
                img.loading = 'lazy';
                card.appendChild(img);
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showFullImageModal(url);
                });
                gridDiv.appendChild(card);
            });
        }
        container.appendChild(gridDiv);
        const carouselContainer = document.querySelector('.carousel-container');
        const functionsDiv = document.querySelector('.functions');
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        isTransitioning = false;
        if (carouselContainer) carouselContainer.style.display = 'none';
        if (functionsDiv) functionsDiv.style.display = 'none';
        container.style.display = 'block';
    }

    function hideSearchResults() {
        if (!searchResultsContainer) return;
        searchResultsContainer.style.display = 'none';
        const carouselContainer = document.querySelector('.carousel-container');
        const functionsDiv = document.querySelector('.functions');
        if (carouselContainer) carouselContainer.style.display = '';
        if (functionsDiv) functionsDiv.style.display = '';
        searchResultsContainer.innerHTML = '';
        if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
        if (!autoPlayInterval) {
            startAutoPlay();
        }
    }

    function showFullImageModal(imgSrc) {
        if (currentImageModal) {
            currentImageModal.remove();
            currentImageModal = null;
        }
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'image-modal-content';
        const img = document.createElement('img');
        img.src = imgSrc;
        contentDiv.appendChild(img);
        const closeIcon = document.createElement('div');
        closeIcon.className = 'image-modal-close';
        closeIcon.innerHTML = '×';
        closeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImageModal();
        });
        modal.appendChild(contentDiv);
        modal.appendChild(closeIcon);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeImageModal();
        });
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        currentImageModal = modal;
        document.addEventListener('keydown', onModalKeyDown);
    }

    function closeImageModal() {
        if (!currentImageModal) return;
        currentImageModal.classList.remove('show');
        setTimeout(() => {
            if (currentImageModal) currentImageModal.remove();
            currentImageModal = null;
        }, 250);
        document.removeEventListener('keydown', onModalKeyDown);
    }

    function onModalKeyDown(e) {
        if (e.key === 'Escape') closeImageModal();
    }

    async function performSearch(keyword) {
        if (!keyword || keyword.trim() === '') {
            hideSearchResults();
            return;
        }
        const map = await loadSearchIndex();
        const urls = map.get(keyword);
        renderImageGrid(urls || [], keyword);
    }

    function bindSearchInput(inputElement) {
        if (!inputElement) return;
        inputElement.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                performSearch(val);
            }, 300);
        });
    }

    initSearchResultsContainer();
    const desktopSearch = document.getElementById('search-input');
    if (desktopSearch) bindSearchInput(desktopSearch);

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            homeCard.classList.remove('exit-left');
            homeCard.classList.add('slide-in');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            animating = false;
            fixLayoutAfterLoad();
        }
    });

    window.addEventListener('resize', function() {
        setFullHeight();
        onScrollOrResize();
    });
    window.addEventListener('scroll', onScrollOrResize);
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            setFullHeight();
            onScrollOrResize();
        }, 30);
    });
    updateMusicBarPosition();
})();