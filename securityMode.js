window.addEventListener('load', function () {
    const securityCheckbox = document.getElementById('security-mode');
    let securityEnabled = false;
    let originalContent = document.body.innerHTML;
    let originalTitle = document.title;
    let pressTimer;
    let isBlocked = false;

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
        localStorage.setItem('securityEnabledState', securityEnabled.toString());
        
        if (securityEnabled) {
            // 开启保护模式时保存当前内容
            originalContent = document.body.innerHTML;
            originalTitle = document.title;
        } else {
            // 关闭保护模式时
            if (isBlocked) {
                restoreContent();
            }
            // 无论是否被阻止，都清除保护标记
            localStorage.removeItem('securityBlocked');
        }
    });

    // 扩展的保护触发条件
    document.addEventListener('visibilitychange', handleProtectionTrigger);
    window.addEventListener('blur', handleProtectionTrigger);

    function handleProtectionTrigger() {
        // 仅在保护模式启用、当前未被阻止、且满足触发条件时执行
        if (securityEnabled && !isBlocked && 
           (document.visibilityState === 'hidden' || document.activeElement === null)) {
            blockPage();
            isBlocked = true;
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
        // 保存当前内容作为恢复点
        if (!isBlocked) {
            originalContent = document.body.innerHTML;
            originalTitle = document.title;
        }
        
        document.title = "THIS SITE IS BLOCKED!";
        document.body.style.cssText = "text-align:center; background:#36648B; font-family:arial; color:#DEDEDE;";
        document.body.innerHTML = '<div style="font-size:90px;margin-top:300px;">该网页已被阻止！</div>';
    }

    function restoreContent() {
        document.body.innerHTML = originalContent;
        document.title = originalTitle;
        document.body.style.cssText = "";
        isBlocked = false;
        
        // 清除保护标记
        localStorage.removeItem('securityBlocked');
        
        // 重新绑定事件监听器
        document.addEventListener('visibilitychange', handleProtectionTrigger);
        window.addEventListener('blur', handleProtectionTrigger);
        
        // 恢复后更新复选框状态
        securityCheckbox.checked = securityEnabled;
    }
});
