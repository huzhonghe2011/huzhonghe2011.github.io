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
                restoreContent();
                // 删除保护标记并刷新
                localStorage.removeItem('securityBlocked');
                location.reload();
            }
        }
    });

    // 扩展的保护触发条件：窗口失去焦点或系统级操作
    document.addEventListener('visibilitychange', handleProtectionTrigger);
    window.addEventListener('blur', handleProtectionTrigger);

    function handleProtectionTrigger() {
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
            pressTimer = setTimeout(restoreContent, 1000);
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

    function restoreContent() {
        document.body.innerHTML = originalContent;
        document.title = originalTitle;
        document.body.style.cssText = "";
        isBlocked = false;
        
        // 删除保护标记并刷新
        localStorage.removeItem('securityBlocked');
        location.reload();
    }
});
