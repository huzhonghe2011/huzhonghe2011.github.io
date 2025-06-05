window.addEventListener('load', function () {
    const securityCheckbox = document.getElementById('security-mode');
    const closeTabCheckbox = document.getElementById('close-tab-mode'); // 新增的关闭标签页复选框
    let securityEnabled = false;
    let closeTabEnabled = false; // 新增的关闭标签页状态
    let originalContent = document.body.innerHTML;
    let originalTitle = document.title;
    let pressTimer;

    // 安全模式切换
    securityCheckbox.addEventListener('change', function () {
        securityEnabled = securityCheckbox.checked;
        if (securityEnabled) {
            originalContent = document.body.innerHTML;
            originalTitle = document.title;
        } else {
            restoreContent();
        }
    });

    // 新增：关闭标签页模式切换
    closeTabCheckbox.addEventListener('change', function () {
        closeTabEnabled = closeTabCheckbox.checked;
    });

    // 标签页切换检测（增强版）
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            if (closeTabEnabled) {
                // 关闭标签页模式（优先级最高）
                try {
                    window.close(); // 尝试直接关闭
                } catch (e) {
                    // 如果浏览器阻止关闭，先导航到空白页再关闭
                    window.location.href = 'about:blank';
                    setTimeout(() => {
                        try { window.close(); } catch (e) {}
                    }, 10);
                }
            } else if (securityEnabled) {
                // 原始安全模式
                document.title = "THIS SITE IS BLOCKED!";
                document.body.style.cssText = "text-align:center; background:#36648B; font-family:arial; color:#DEDEDE;";
                document.body.innerHTML = '<div style="font-size:90px;margin-top:300px;">该网页已被阻止！</div>';
            }
        }
    });

    // 长按恢复功能
    document.addEventListener('mousedown', startPressTimer);
    document.addEventListener('touchstart', startPressTimer);
    document.addEventListener('mouseup', cancelPressTimer);
    document.addEventListener('touchend', cancelPressTimer);
    document.addEventListener('mouseleave', cancelPressTimer);

    function startPressTimer() {
        if (securityEnabled && !closeTabEnabled) {
            pressTimer = setTimeout(restoreContent, 1000);
        }
    }

    function cancelPressTimer() {
        clearTimeout(pressTimer);
    }

    function restoreContent() {
        document.body.innerHTML = originalContent;
        document.title = originalTitle;
        document.body.style.cssText = "";
    }
});
