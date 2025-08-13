// nof12.js - 可靠开发者工具拦截系统
(function() {
    // 状态标志
    let devtoolsOpen = false;
    let isRedirecting = false;
    let lastCheckTime = 0;
    
    // 静默跳转函数
    function redirectSilently() {
        if (isRedirecting) return;
        isRedirecting = true;
        
        // 清除所有检测机制
        clearInterval(detectionInterval);
        document.removeEventListener('contextmenu', contextMenuHandler);
        document.removeEventListener('keydown', keyDownHandler);
        window.removeEventListener('load', initialDetection);
        
        // 执行跳转
        window.location.href = 'https://example.com/redirect';
    }

    // 优化的开发者工具检测
    function checkDevTools() {
        // 避免频繁检测
        const now = Date.now();
        if (now - lastCheckTime < 1000) return devtoolsOpen;
        lastCheckTime = now;
        
        // 方法1: 控制台检测
        const start = Date.now();
        console.log('detection');
        console.clear();
        const diff = Date.now() - start;
        
        // 控制台操作耗时检测
        if (diff > 100) {
            return true;
        }
        
        // 方法2: 特殊属性检测
        try {
            const element = document.createElement('div');
            Object.defineProperty(element, 'id', {
                get: function() {
                    devtoolsOpen = true;
                    return 'detection';
                }
            });
            
            // 触发检测
            console.log(element.id);
        } catch(e) {
            // 忽略错误
        }
        
        return devtoolsOpen;
    }

    // 初始检测
    function initialDetection() {
        // 延迟检测避免误判
        setTimeout(() => {
            if (checkDevTools()) {
                redirectSilently();
            }
        }, 1000);
    }

    // 定期检查开发者工具状态
    const detectionInterval = setInterval(() => {
        if (checkDevTools()) {
            redirectSilently();
        }
    }, 2000); // 降低检测频率

    // 禁用右键菜单
    function contextMenuHandler(e) {
        e.preventDefault();
    }
    document.addEventListener('contextmenu', contextMenuHandler);

    // 拦截开发者工具快捷键 - 只拦截不跳转
    function keyDownHandler(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return;
        }
        
        // Ctrl+Shift+I (Cmd+Opt+I for Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
            e.preventDefault();
            return;
        }
        
        // Ctrl+U (查看源代码)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            return;
        }
        
        // Ctrl+Shift+J (Cmd+Opt+J for Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return;
        }
        
        // Ctrl+Shift+C (检查元素)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return;
        }
        
        // Ctrl+Shift+K (Firefox开发者工具)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            return;
        }
    }
    document.addEventListener('keydown', keyDownHandler);

    // 页面加载完成后立即检测
    window.addEventListener('load', initialDetection);
    
    // 初始轻量级检测
    setTimeout(() => {
        // 简单控制台检测
        const start = Date.now();
        console.log('initial-detection');
        console.clear();
        const diff = Date.now() - start;
        
        // 如果控制台操作耗时过长
        if (diff > 150) {
            redirectSilently();
        }
    }, 500);
})();
