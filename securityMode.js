window.addEventListener('load', function () {
    const securityCheckbox = document.getElementById('security-mode');
    let securityEnabled = false;
    let originalContent = document.body.innerHTML;
    let originalTitle = document.title;
    let pressTimer;
    let isBlocked = false; // 跟踪当前是否处于被阻止状态

    // 从本地存储加载复选框状态
    const savedState = localStorage.getItem('securityEnabledState');
    securityEnabled = savedState === 'true';
    securityCheckbox.checked = securityEnabled;

    // 检查保护标记是否存在
    if (localStorage.getItem('securityBlocked') === 'true') {
        blockPage();
        isBlocked = true;
    }

    // 安全模式切换
    securityCheckbox.addEventListener('change', function () {
        securityEnabled = securityCheckbox.checked;
        localStorage.setItem('securityEnabledState', securityEnabled);
        
        if (securityEnabled) {
            originalContent = document.body.innerHTML;
            originalTitle = document.title;
        } else {
            // 关闭保护模式时恢复内容
            if (isBlocked) {
                restoreContent(true); // 传递true表示需要刷新
            }
        }
    });

    // 扩展的保护触发条件：窗口失去焦点或系统级操作
    document.addEventListener('visibilitychange', handleProtectionTrigger);
    window.addEventListener('blur', handleProtectionTrigger);

    function handleProtectionTrigger() {
        // 避免在页面卸载过程中触发
        if (document.visibilityState === 'hidden' && performance.navigation.type === 1) {
            return;
        }
        
        if (securityEnabled && !isBlocked && 
           (document.visibilityState === 'hidden' || document.activeElement === null)) {
            blockPage();
            isBlocked = true;
            // 存储保护标记
            localStorage.setItem('securityBlocked', 'true');
        }
    }

    // 长按恢复功能
    document.addEventListener('mousedown', startPressTimer);
    document.addEventListener('touchstart', startPressTimer);
    document.addEventListener('mouseup', cancelPressTimer);
    document.addEventListener('touchend', cancelPressTimer);
    document.addEventListener('mouseleave', cancelPressTimer);

    function startPressTimer() {
        if (isBlocked) {
            pressTimer = setTimeout(() => restoreContent(true), 1000);
        }
    }

    function cancelPressTimer() {
        clearTimeout(pressTimer);
    }

    function blockPage() {
        document.title = "THIS SITE IS BLOCKED!";
        document.body.style.cssText = "text-align:center; background:#36648B; font-family:arial; color:#DEDEDE;";
        document.body.innerHTML = '<div style="font-size:90px;margin-top:300px;">该网页已被阻止！</div>';
    }

    function restoreContent(shouldRefresh = false) {
        document.body.innerHTML = originalContent;
        document.title = originalTitle;
        document.body.style.cssText = "";
        isBlocked = false;
        
        // 删除保护标记
        localStorage.removeItem('securityBlocked');
        
        if (shouldRefresh) {
            // 刷新前保存复选框状态
            const currentState = securityCheckbox.checked;
            // 刷新页面
            location.reload();
            // 恢复复选框状态
            securityCheckbox.checked = currentState;
        }
    }
});
