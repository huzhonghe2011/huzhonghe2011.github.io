// nof12.js - 优化版开发者工具拦截系统
(function() {
    // 状态标志
    let isRedirecting = false;
    let lastVisibleTime = Date.now();
    
    // 静默跳转函数
    function redirectSilently() {
        if (isRedirecting) return;
        isRedirecting = true;
        
        // 清除所有检测机制
        clearInterval(detectionInterval);
        document.removeEventListener('contextmenu', contextMenuHandler);
        document.removeEventListener('keydown', keyDownHandler);
        window.removeEventListener('load', initialDetection);
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        
        // 执行跳转
        window.location.href = 'https://example.com/redirect';
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
        // 初始检测使用更长的阈值
        const now = Date.now();
        if (now - lastDetectionTime > 1000) {
            redirectSilently();
        }
    }

    // 处理页面可见性变化
    function visibilityChangeHandler() {
        if (document.visibilityState === 'visible') {
            // 页面重新可见时更新时间戳
            lastVisibleTime = Date.now();
            // 立即触发一次检测
            try {
                console.log(devToolsDetector.id);
            } catch(e) {
                redirectSilently();
            }
        }
    }
    document.addEventListener('visibilitychange', visibilityChangeHandler);



    // 禁用右键菜单
    function contextMenuHandler(e) {
        e.preventDefault();
        // 右键菜单时也触发检测
        try {
            console.log(devToolsDetector.id);
        } catch(e) {
            redirectSilently();
        }
    }
    document.addEventListener('contextmenu', contextMenuHandler);

    // 拦截开发者工具快捷键 - 最高优先级
    function keyDownHandler(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+Shift+I (Cmd+Opt+I for Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+U (查看源代码)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+Shift+J (Cmd+Opt+J for Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            redirectSilently();
            return;
        }
        
        // Ctrl+Shift+C (检查元素)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
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
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.shiftKey) {
            e.preventDefault();
            redirectSilently();
            return;
        }
    }
    document.addEventListener('keydown', keyDownHandler);

    // 页面加载完成后立即检测
    window.addEventListener('load', initialDetection);
    
    // 初始立即触发检测 - 解决预打开开发者工具的问题
    setTimeout(() => {
        try {
            console.log(devToolsDetector.id);
            
            // 初始状态检测
            const initialCheckTime = Date.now();
            if (initialCheckTime - lastDetectionTime > 300) {
                redirectSilently();
            }
        } catch(e) {
            redirectSilently();
        }
    }, 300);

        // 定期检查开发者工具状态
    const detectionInterval = setInterval(() => {
        const now = Date.now();
        
        // 忽略页面不可见时的检测
        if (document.visibilityState !== 'visible') {
            lastDetectionTime = now; // 防止误判
            return;
        }
        
        const timeSinceLastDetection = now - lastDetectionTime;
        const timeSinceVisible = now - lastVisibleTime;
        
        // 双重检测：开发者工具状态和页面活跃状态
        if (timeSinceLastDetection > 300 && timeSinceVisible < 1000) {
            redirectSilently();
        }
        
        // 触发属性检测
        try {
            console.log(devToolsDetector.id);
        } catch(e) {
            redirectSilently();
        }
    }, 150); // 稍长的检测间隔
})();
