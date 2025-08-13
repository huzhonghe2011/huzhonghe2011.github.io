// nof12.js - 开发者工具拦截与保护系统
(function() {
    // 静默跳转函数
    function redirectSilently() {
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
        const now = Date.now();
        if (now - lastDetectionTime > 200) {
            redirectSilently();
        }
    }

    // 定期检查开发者工具状态
    setInterval(() => {
        const now = Date.now();
        const timeSinceLastDetection = now - lastDetectionTime;
        
        // 如果检测间隔异常，可能开发者工具已打开
        if (timeSinceLastDetection > 200) {
            redirectSilently();
        }
        
        // 触发属性检测
        console.log(devToolsDetector.id);
    }, 100);

    // 禁用右键菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // 拦截开发者工具快捷键
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            redirectSilently();
        }
        
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            redirectSilently();
        }
        
        // Ctrl+U
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            redirectSilently();
        }
        
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            redirectSilently();
        }
        
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            redirectSilently();
        }
        
        // Ctrl+P (打印)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            redirectSilently();
        }
        
        // Ctrl+S (保存网页)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            redirectSilently();
        }
    });

    // 页面加载完成后立即检测
    window.addEventListener('load', initialDetection);
})();
