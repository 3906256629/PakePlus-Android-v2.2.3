(function() {
    const trackBar = document.getElementById('trackBar');
    const slider = document.getElementById('movingSlider');
    
    if (!trackBar || !slider) return;
    
    const CYCLE_DURATION = 2000;
    const TOTAL_CYCLES = 3;
    
    let currentCycle = 0;
    let startTime = performance.now();
    let animationId = null;
    let redirectScheduled = false;
    
    let cachedTrackWidth = 0;
    let maxSliderWidth = 0;
    let currentProgress = 0;
    let resizeObserver = null;
    
    function updateDimensions() {
        const rect = trackBar.getBoundingClientRect();
        cachedTrackWidth = rect.width;
        const baseMax = cachedTrackWidth * 0.45;
        maxSliderWidth = Math.min(baseMax, Math.max(48, cachedTrackWidth * 0.4));
        if (maxSliderWidth < 4) maxSliderWidth = Math.min(cachedTrackWidth * 0.4, 32);
    }
    
    function computeSliderStyle(progress) {
        const t = 2 * progress - 1;
        const widthFactor = 1 - t * t;
        let width = maxSliderWidth * widthFactor;
        width = Math.min(width, cachedTrackWidth);
        width = Math.max(width, 0);
        const maxLeft = cachedTrackWidth - width;
        let left = progress * maxLeft;
        left = Math.min(Math.max(left, 0), maxLeft);
        return { width, left };
    }
    
    function applyTransform(progress) {
        if (!slider || cachedTrackWidth <= 0) return;
        const { width, left } = computeSliderStyle(progress);
        slider.style.width = width + 'px';
        slider.style.transform = `translateX(${left}px)`;
    }
    
    function redirectToInitialize() {
        if (redirectScheduled) return;
        redirectScheduled = true;
        if (animationId) cancelAnimationFrame(animationId);
        if (resizeObserver) resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
        setTimeout(() => {
            window.location.href = '/place/initial.html';
        }, 30);
    }
    
    function handleResize() {
        if (redirectScheduled) return;
        updateDimensions();
        applyTransform(currentProgress);
    }
    
    function animate(now) {
        if (redirectScheduled) return;
        const elapsed = now - startTime;
        let progress = Math.min(1, elapsed / CYCLE_DURATION);
        currentProgress = progress;
        applyTransform(progress);
        if (progress >= 1) {
            currentCycle++;
            if (currentCycle >= TOTAL_CYCLES) {
                redirectToInitialize();
                return;
            }
            startTime = now;
            currentProgress = 0;
        }
        animationId = requestAnimationFrame(animate);
    }
    
    function startAnimation() {
        updateDimensions();
        if (cachedTrackWidth === 0) {
            setTimeout(startAnimation, 100);
            return;
        }
        currentCycle = 0;
        startTime = performance.now();
        currentProgress = 0;
        applyTransform(0);
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(trackBar);
        } else {
            window.addEventListener('resize', handleResize);
        }
        animationId = requestAnimationFrame(animate);
    }
    
    startAnimation();
})();