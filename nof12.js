// nof12.js - 优化版开发者工具拦截系统
(function() {
    // 状态标志
    let devtoolsOpen = false;
    let isRedirecting = false;
    let lastDebuggerTime = 0;
    
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

    // 优化的debugger检测
    function checkDevTools() {
        // 避免频繁检测
        const now = Date.now();
        if (now - lastDebuggerTime < 1000) return devtoolsOpen;
        lastDebuggerTime = now;
        
        let detected = false;
        
        try {
            // 创建特殊检测对象
            const debuggerObject = {};
            
            // 添加调试陷阱
            Object.defineProperty(debuggerObject, 'devToolsTrap', {
                get: function() {
                    detected = true;
                    return true;
                }
            });
            
            // 创建iframe进行隔离检测
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // 在iframe中设置调试器
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <script>
                    // 设置调试陷阱
                    Object.defineProperty(window, 'debuggerTrap', {
                        get: function() {
                            parent.postMessage('devtools-detected', '*');
                            debugger;
                        }
                    });
                </script>
            `);
            iframeDoc.close();
            
            // 尝试访问属性触发检测
            iframe.contentWindow.debuggerTrap;
            
            // 清理iframe
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 100);
            
        } catch (e) {
            // 忽略错误
        }
        
        // 如果检测到开发者工具
        if (detected) {
            devtoolsOpen = true;
            return true;
        }
        
        return false;
    }

    // 初始检测
    function initialDetection() {
        // 延迟检测避免误判
        setTimeout(() => {
            if (checkDevTools()) {
                redirectSilently();
            }
        }, 1500);
    }

    // 消息监听 - 处理iframe检测结果
    window.addEventListener('message', (e) => {
        if (e.data === 'devtools-detected') {
            devtoolsOpen = true;
            redirectSilently();
        }
    });

    // 定期检查开发者工具状态
    const detectionInterval = setInterval(() => {
        // 轻量级检测：窗口尺寸变化
        const widthThreshold = window.outerWidth - window.innerWidth > 100;
        const heightThreshold = window.outerHeight - window.innerHeight > 100;
        
        if (widthThreshold || heightThreshold) {
            devtoolsOpen = true;
            redirectSilently();
            return;
        }
        
        // 每5秒进行一次debugger检测
        if (Date.now() - lastDebuggerTime > 5000) {
            if (checkDevTools()) {
                redirectSilently();
            }
        }
    }, 1000);

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
    }
    document.addEventListener('keydown', keyDownHandler);

    // 页面加载完成后立即检测
    window.addEventListener('load', initialDetection);
    
    // 初始轻量级检测 - 解决预打开问题
    setTimeout(() => {
        // 初始尺寸检测
        const widthThreshold = window.outerWidth - window.innerWidth > 100;
        const heightThreshold = window.outerHeight - window.innerHeight > 100;
        
        if (widthThreshold || heightThreshold) {
            devtoolsOpen = true;
            redirectSilently();
        }
    }, 500);
})();
