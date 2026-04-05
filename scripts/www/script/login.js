(function() {
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setCookie(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
    }

    function eraseCookie(name) {
        document.cookie = `${name}=0; path=/; max-age=0`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function showLoginUI() {
        const container = document.getElementById('dynamicContent');
        container.innerHTML = `
            <div class="login-form">
                <div id="formFeedback" style="min-height: 52px;"></div>
                <div class="input-group">
                    <label class="input-label" for="loginName">登录名</label>
                    <input type="text" id="loginName" class="input-field" placeholder="请输入登录名" autocomplete="username">
                </div>
                <div class="input-group">
                    <label class="input-label" for="password">密码</label>
                    <input type="password" id="password" class="input-field" placeholder="请输入密码" autocomplete="current-password">
                </div>
                <button id="doLoginBtn" class="login-btn">登录</button>
            </div>
        `;

        const loginBtn = document.getElementById('doLoginBtn');
        const loginNameInput = document.getElementById('loginName');
        const passwordInput = document.getElementById('password');
        const feedbackDiv = document.getElementById('formFeedback');

        async function performLogin() {
            const username = loginNameInput.value.trim();
            const password = passwordInput.value;
            if (!username || !password) {
                feedbackDiv.innerHTML = '<div class="error-message">请填写完整的登录名和密码</div>';
                return;
            }

            feedbackDiv.innerHTML = '<div class="success-message"><span class="spinner"></span> 验证中...</div>';
            loginBtn.disabled = true;
            loginBtn.classList.add('btn-loading');

            try {
                const response = await fetch('/text/user.txt', { cache: 'no-store' });
                if (!response.ok) throw new Error();
                const text = await response.text();
                const lines = text.split(/\r?\n/);
                let valid = false;
                for (let line of lines) {
                    line = line.trim();
                    if (line === '' || line.startsWith('#')) continue;
                    const eqIndex = line.indexOf('=');
                    if (eqIndex === -1) continue;
                    const fileUser = line.substring(0, eqIndex).trim();
                    const filePass = line.substring(eqIndex + 1).trim();
                    if (fileUser === username && filePass === password) {
                        valid = true;
                        break;
                    }
                }
                if (valid) {
                    setCookie('user', username);
                    window.location.href = '/place/home.html';
                } else {
                    feedbackDiv.innerHTML = '<div class="error-message">登录名或密码错误</div>';
                    loginBtn.disabled = false;
                    loginBtn.classList.remove('btn-loading');
                }
            } catch (err) {
                feedbackDiv.innerHTML = '<div class="error-message">服务器验证失败，请稍后重试</div>';
                loginBtn.disabled = false;
                loginBtn.classList.remove('btn-loading');
            }
        }

        loginBtn.addEventListener('click', performLogin);
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performLogin();
            }
        };
        loginNameInput.addEventListener('keypress', handleKeyPress);
        passwordInput.addEventListener('keypress', handleKeyPress);
    }

    function showLogoutUI(username) {
        const container = document.getElementById('dynamicContent');
        const avatarUrl = `/image/avatar/${encodeURIComponent(username)}.png`;
        container.innerHTML = `
            <div class="logout-section">
                <img src="${avatarUrl}" style="display: block; width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto;" onerror="this.style.display='none'" alt="">
                <div class="welcome-text">你好，<span class="user-name">${escapeHtml(username)}</span></div>
                <div class="logout-desc">您已经登录 TogetherEver</div>
                <button id="doLogoutBtn" class="logout-btn">退出登录</button>
                <a href="/place/home.html" class="home-link">回到首页</a>
            </div>
        `;

        const logoutBtn = document.getElementById('doLogoutBtn');
        logoutBtn.addEventListener('click', () => {
            eraseCookie('user');
            showLoginUI();
        });
    }

    function init() {
        const userVal = getCookie('user');
        if (userVal && userVal !== '0' && userVal !== '') {
            showLogoutUI(userVal);
        } else {
            showLoginUI();
        }
    }

    init();
})();