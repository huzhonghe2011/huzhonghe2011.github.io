// nof12.js - 开发者工具拦截与保护系统
(function() {
    // 静默跳转函数
    function redirectSilently() {
        // 清除所有检测机制
        clearInterval(detectionInterval);
        document.removeEventListener('contextmenu', contextMenuHandler);
        document.removeEventListener('keydown', keyDownHandler);
        window.removeEventListener('load', initialDetection);
        
        // 执行跳转
        window.location.href = 'https://www.yuanshen.com/#/';
    }

    // 创建检测元素
    const devToolsDetector = document.createElement('div');
    devToolsDetector.id = 'devToolsDetector';
    devToolsDetector.style.display = 'none';
    
    // 重写属性以检测开发者工具访问
    let lastDetectionTime = Date.now();
    Object.defineProperty(devToolsDetector, 'id', {
        get: function() {
            lastDetectionTime = Date.now();
            return 'devToolsDetector';
        }
    });
    
    document.body.appendChild(devToolsDetector);

    // 初始检测
    function initialDetection() {
        const now = Date.now();
        // 延长初始检测时间阈值
        if (now - lastDetectionTime > 500) {
            redirectSilently();
        }
    }

    // 定期检查开发者工具状态
    const detectionInterval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastDetection = now - lastDetectionTime;
        
        // 如果检测间隔异常，可能开发者工具已打开
        if (timeSinceLastDetection > 200) {
            redirectSilently();
        }
        
        // 触发属性检测
        try {
            console.log(devToolsDetector.id);
        } catch(e) {
            // 如果检测元素被移除，也视为异常
            redirectSilently();
        }
    }, 100);

    // 禁用右键菜单
    function contextMenuHandler(e) {
        e.preventDefault();
        // 右键菜单时也触发检测
        console.log(devToolsDetector.id);
    }
    document.addEventListener('contextmenu', contextMenuHandler);

    // 拦截开发者工具快捷键
    function keyDownHandler(e) {
        // F12 - 最高优先级拦截
        if (e.key === 'F12') {
            e.preventDefault();
            redirectSilently();
            return; // 立即返回，不执行后续检测
        }
        
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+U
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+P (打印)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+S (保存网页)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // 额外检测：任何Ctrl+Alt+Shift组合键
        if (e.ctrlKey && e.altKey && e.shiftKey) {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // 触发常规检测（针对其他可能的开发者工具打开方式）
        console.log(devToolsDetector.id);
    }
    document.addEventListener('keydown', keyDownHandler);

    // 页面加载完成后立即检测
    window.addEventListener('load', initialDetection);
    
    // 初始立即触发一次检测
    setTimeout(() => {
        console.log(devToolsDetector.id);
    }, 50);
})();
