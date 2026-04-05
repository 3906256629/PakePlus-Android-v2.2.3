(function() {
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    if (getCookie('termsAccepted') === '1') {
        window.location.href = "home.html";
        return;
    }

    const pageContents = [
        `<div class="page-item">
            <div class="terms-text">
                <h2>使用条款</h2>
                <p><strong>最后更新日期：</strong> 2026年3月13日</p>
                <p>欢迎访问本网站。本网站由团队成员自愿发起并维护，为班级同学、老师及家长朋友提供分享毕业回忆、保持联络的站点空间。<strong>本网站仅限上述群体访问。</strong> 通过访问或使用本网站，您确认属于上述群体并同意遵守本条款。</p>
                
                <h3>1. 网站性质</h3>
                <p>本网站为非商业性质的留念平台，不涉及商品交易、广告投放或营利行为。所有内容均为班级成员自愿分享。</p>
                
                <h3>2. 账户与访问</h3>
                <p>网站设置登录功能，请妥善保管个人凭证，不得与他人共享。管理员有权在出现安全风险或违规行为时暂停访问权限。</p>
                
                <h3>3. 用户行为规范</h3>
                <p>您在本网站上传或发布的内容（照片、文字、留言等）应符合留念主题，禁止包含侮辱、歧视、暴力、色情或违法内容。未经他人同意，不得发布他人敏感个人信息。留言互动请保持友善，共同维护班级情谊。</p>
                
                <h3>4. 内容管理</h3>
                <p>管理员保留移除不符合留念宗旨或侵犯他人权益内容的权利。如发现您的照片或信息被不当使用，请联系管理员处理。</p>
                
                <h3>5. 知识产权与授权</h3>
                <p>您保留对上传内容的所有权，但授予本网站有限的非独占许可，用于在网站内展示。未经上传者同意，其他成员不得将网站内容复制、转载至外部平台或用于商业用途。</p>
                
                <h3>6. 免责声明</h3>
                <p>本网站由团队自愿维护，竭力保障稳定运行，但不对技术故障、数据丢失或不可抗力导致的损失承担责任。重要资料请自行备份。</p>
                
                <h3>7. 条款修改</h3>
                <p>我们可能更新本条款，并将通过网站公告或班级群通知。修改后继续使用即视为接受更新。</p>
            </div>
        </div>`,
        `<div class="page-item">
            <div class="terms-text">
                <h2>隐私政策</h2>
                <p><strong>最后更新日期：</strong> 2026年3月13日</p>
                <p>我们重视每一位同学的隐私。本政策说明我们如何处理您的信息。我们承诺：不收集超出必要范围的信息，不用于商业目的，不与第三方随意共享。</p>
                
                <h3>1. 我们收集的信息</h3>
                <p><strong>主动提供：</strong> 注册时的姓名/昵称、上传的照片与留言、联系管理员时提供的联系方式。<br>
                <strong>自动收集：</strong> IP地址、访问时间、浏览器类型、访问页面等（仅用于安全与统计）。</p>
                
                <h3>2. 信息的使用</h3>
                <p>用于展示留念内容、维持网站运行、回应您的请求、保障网站安全。不会用于任何商业营销。</p>
                
                <h3>3. 信息的共享</h3>
                <p>我们不会出售您的个人信息。仅在以下情况共享：获得您明确同意、法律法规要求、或为保护本网站及成员安全。网站托管于可信赖的第三方云服务商（Cloudflare），其遵守相应安全标准。</p>
                
                <h3>4. 数据安全与保留</h3>
                <p>我们采用HTTPS加密、定期更新等基础措施。您上传的内容将在网站持续展示直至您或管理员删除。若网站停止运营，将提前通知并删除所有个人数据。</p>
                
                <h3>5. 您的权利</h3>
                <p>您可以随时联系管理员访问、更正或删除您的个人信息。撤回同意不影响撤回前基于同意的处理。</p>
                
                <h3>6. 儿童隐私</h3>
                <p>本网站面向已毕业班级成员，若未满14周岁用户访问，请监护人知悉本政策。</p>
                
                <h3>7. 政策变更</h3>
                <p>我们可能更新本条款，并将通过网站公告或班级群通知。修改后继续使用即视为接受更新。</p>
            </div>
        </div>`,
        `<div class="page-item">
            <div class="terms-text">
                <h2>Cookie 首选项</h2>
                <p>本网站使用必要的Cookie来保障登录、安全等核心功能。我们尊重您的隐私，不会使用追踪类Cookie。</p>
                
                <h3>1. 什么是Cookie</h3>
                <p>Cookie是存储在您设备上的小型文本文件，帮助网站记住您的状态和偏好。</p>
                
                <h3>2. 我们使用的Cookie类型</h3>
                <p><strong>必要Cookie：</strong> 用于登录状态、安全防护，无法禁用。<br>
                <strong>偏好Cookie：</strong> 记录显示设置。<br>
                <strong>分析Cookie：</strong> 仅匿名统计访问量，不追踪个人。</p>
                
                <h3>3. 第三方服务</h3>
                <p>本网站嵌入社交平台和简单统计工具，这些第三方可能会设置自己的Cookie，我们无法直接控制，建议查阅其隐私政策。</p>
                
                <h3>4. Cookie 首选项</h3>
                <p>您可以选择接受或拒绝非必要的分析类Cookie（本网站仅基础分析，默认尊重您的选择）</p>
                <div class="cookie-pref">
                    <div class="cookie-switch-row">
                        <span class="cookie-label">用户体验增强计划</span>
                        <label class="switch">
                            <input type="checkbox" id="cookieToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="cookie-status" id="cookieStatusMsg">仅使用必要的 Cookie</div>
                </div>
                
                <h3>5. 管理Cookie</h3>
                <p>您也可通过浏览器设置管理或删除Cookie。强制禁用必要Cookie可能导致部分功能无法使用。</p>
            </div>
        </div>`
    ];

    let currentIndex = 0;
    let animating = false;
    const sliderStage = document.getElementById('sliderStage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const termsCard = document.getElementById('termsCard');

    function setCookie(name, value, days = 365) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
    }

    function bindCookieSwitch() {
        const toggle = document.getElementById('cookieToggle');
        const statusSpan = document.getElementById('cookieStatusMsg');
        if (!toggle) return;

        const storedPref = getCookie('cookiePreference');
        if (storedPref === '1') {
            toggle.checked = true;
            statusSpan.innerText = '已启用可选的 Cookie';
        } else if (storedPref === '0') {
            toggle.checked = false;
            statusSpan.innerText = '已停用可选的 Cookie';
        } else {
            toggle.checked = false;
            statusSpan.innerText = '仅使用必要的 Cookie';
        }

        const handler = function(e) {
            const isChecked = e.target.checked;
            if (isChecked) {
                setCookie('cookiePreference', '1');
                statusSpan.innerText = '已启用可选的 Cookie';
            } else {
                setCookie('cookiePreference', '0');
                statusSpan.innerText = '已停用可选的 Cookie';
            }
        };
        toggle.removeEventListener('change', handler);
        toggle.addEventListener('change', handler);
    }

    function updateButtons() {
        prevBtn.disabled = (currentIndex === 0);
        if (currentIndex === pageContents.length - 1) {
            nextBtn.textContent = '同意并继续';
        } else {
            nextBtn.textContent = '下一页';
        }
    }

    function setButtonsDisabled(disabled) {
        prevBtn.disabled = disabled || (currentIndex === 0);
        nextBtn.disabled = disabled;
        if (disabled && currentIndex === pageContents.length - 1) {
            nextBtn.disabled = true;
        } else if (!disabled) {
            updateButtons();
        }
    }

    function performPageTransition(newIndex) {
        if (animating) return false;
        if (newIndex === currentIndex) return false;
        if (newIndex < 0 || newIndex >= pageContents.length) return false;

        const direction = newIndex > currentIndex ? 'next' : 'prev';
        animating = true;
        setButtonsDisabled(true);

        const oldElem = sliderStage.children[0];
        if (!oldElem) {
            sliderStage.innerHTML = pageContents[newIndex];
            currentIndex = newIndex;
            if (currentIndex === 2) bindCookieSwitch();
            const freshPage = sliderStage.querySelector('.page-item');
            if (freshPage) freshPage.scrollTop = 0;
            setButtonsDisabled(false);
            animating = false;
            return true;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = pageContents[newIndex];
        const newElem = tempDiv.firstElementChild;
        newElem.style.position = 'absolute';
        newElem.style.top = '0';
        newElem.style.left = '0';
        newElem.style.width = '100%';
        newElem.style.willChange = 'transform, opacity';
        
        const moveDistance = '100%';
        let oldEndTransform = '';
        let newStartTransform = '';
        
        if (direction === 'next') {
            oldEndTransform = `translateX(-${moveDistance})`;
            newStartTransform = `translateX(${moveDistance})`;
        } else {
            oldEndTransform = `translateX(${moveDistance})`;
            newStartTransform = `translateX(-${moveDistance})`;
        }
        
        oldElem.style.transition = 'transform 0.35s ease-out, opacity 0.3s ease-out';
        oldElem.style.transform = 'translateX(0)';
        oldElem.style.opacity = '1';
        
        newElem.style.transform = newStartTransform;
        newElem.style.opacity = '0';
        newElem.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        
        const currentHeight = sliderStage.offsetHeight;
        if (currentHeight) sliderStage.style.minHeight = currentHeight + 'px';
        
        sliderStage.appendChild(newElem);
        
        requestAnimationFrame(() => {
            oldElem.style.transform = oldEndTransform;
            oldElem.style.opacity = '0';
            newElem.style.transform = 'translateX(0)';
            newElem.style.opacity = '1';
        });
        
        const finishTransition = () => {
            oldElem.removeEventListener('transitionend', finishTransition);
            newElem.removeEventListener('transitionend', finishTransition);
            sliderStage.innerHTML = pageContents[newIndex];
            sliderStage.style.minHeight = '';
            currentIndex = newIndex;
            if (currentIndex === 2) bindCookieSwitch();
            const finalPage = sliderStage.querySelector('.page-item');
            if (finalPage) finalPage.scrollTop = 0;
            setButtonsDisabled(false);
            animating = false;
        };
        
        oldElem.addEventListener('transitionend', finishTransition, { once: true });
        newElem.addEventListener('transitionend', finishTransition, { once: true });
        
        setTimeout(() => {
            if (animating) finishTransition();
        }, 500);
        
        return true;
    }

    function handleNext() {
        if (animating) return;
        if (currentIndex === pageContents.length - 1) {
            setCookie('termsAccepted', '1');
            document.body.classList.add('exit-active');
            termsCard.classList.add('slide-out-left');
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
            return;
        }
        performPageTransition(currentIndex + 1);
    }

    function handlePrev() {
        if (animating) return;
        if (currentIndex > 0) {
            performPageTransition(currentIndex - 1);
        }
    }

    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);

    setTimeout(() => {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }
        sliderStage.innerHTML = pageContents[0];
        currentIndex = 0;
        updateButtons();
        termsCard.classList.add('slide-in');
        const firstPage = sliderStage.querySelector('.page-item');
        if (firstPage) firstPage.scrollTop = 0;
    }, 1000);
})();