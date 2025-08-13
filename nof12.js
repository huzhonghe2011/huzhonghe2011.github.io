// nof12.js - 精准开发者工具拦截系统
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

    // 安全可靠的debugger检测
    function checkDevTools() {
        // 避免频繁检测
        const now = Date.now();
        if (now - lastDebuggerTime < 1500) return devtoolsOpen;
        lastDebuggerTime = now;
        
        return new Promise(resolve => {
            try {
                // 创建隔离检测环境
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // 设置检测超时
                const detectionTimeout = setTimeout(() => {
                    document.body.removeChild(iframe);
                    resolve(false);
                }, 300);
                
                // 在iframe中设置调试器陷阱
                iframe.contentWindow.eval(`
                    Object.defineProperty(window, 'debuggerTrap', {
                        get: function() {
                            clearTimeout(parent.detectionTimeout);
                            parent.postMessage('devtools-detected', '*');
                            debugger;
                        }
                    });
                    // 触发检测
                    window.debuggerTrap;
                `);
                
                // 保存超时引用
                window.detectionTimeout = detectionTimeout;
                
            } catch (e) {
                resolve(false);
            }
        });
    }

    // 消息监听 - 处理检测结果
    window.addEventListener('message', (e) => {
        if (e.data === 'devtools-detected') {
            devtoolsOpen = true;
            redirectSilently();
        }
    });

    // 初始检测
    function initialDetection() {
        // 延迟检测避免误判
        setTimeout(() => {
            checkDevTools().then(result => {
                if (result) redirectSilently();
            });
        }, 2000);
    }

    // 定期检查开发者工具状态
    const detectionInterval = setInterval(() => {
        if (!devtoolsOpen) {
            checkDevTools().then(result => {
                if (result) redirectSilently();
            });
        }
    }, 3000); // 较长的检测间隔

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
    
    // 初始轻量级检测 - 避免立即跳转
    setTimeout(() => {
        // 初始检测但不跳转
        checkDevTools().then(result => {
            if (result) {
                devtoolsOpen = true;
                // 不立即跳转，等待定期检测处理
            }
        });
    }, 1000);
})();
