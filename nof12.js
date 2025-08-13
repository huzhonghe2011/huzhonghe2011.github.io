// nof12.js - 开发者工具拦截与检测系统
(function() {
    // 状态标志
    let devtoolsOpen = false;
    let isRedirecting = false;
    
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
        window.location.href = 'https://www.yuanshen.com/#/';
    }

    // 主要检测函数 - 使用debugger检测
    function checkDevTools() {
        if (devtoolsOpen) return true;
        
        const startTime = performance.now();
        
        try {
            // 创建并执行debugger检测
            (function() {
                // 使用特殊对象防止被直接检测
                const obj = {};
                Object.defineProperty(obj, 'isDevTools', {
                    get: () => {
                        // 强制进入debugger
                        debugger;
                    }
                });
                
                // 尝试访问属性触发debugger
                obj.isDevTools;
            })();
        } catch (e) {
            // 忽略错误
        }
        
        const diff = performance.now() - startTime;
        
        // 如果执行时间异常长，说明debugger被触发
        if (diff > 200) {
            devtoolsOpen = true;
            return true;
        }
        
        return false;
    }

    // 初始检测
    function initialDetection() {
        // 立即检测一次
        if (checkDevTools()) {
            redirectSilently();
        }
    }

    // 定期检查开发者工具状态
    let lastCheckTime = Date.now();
    const detectionInterval = setInterval(() => {
        // 每10次检测使用一次debugger检测（避免性能问题）
        if (Math.random() < 0.1 || Date.now() - lastCheckTime > 3000) {
            if (checkDevTools()) {
                redirectSilently();
            }
            lastCheckTime = Date.now();
        }
        
        // 常规检测：检查窗口尺寸变化
        const widthThreshold = window.outerWidth - window.innerWidth > 100;
        const heightThreshold = window.outerHeight - window.innerHeight > 100;
        
        if (widthThreshold || heightThreshold) {
            devtoolsOpen = true;
            redirectSilently();
        }
    }, 500);

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
    
    // 初始立即触发检测 - 解决预打开问题
    setTimeout(() => {
        if (checkDevTools()) {
            redirectSilently();
        }
    }, 1000);
    
    // 额外检测：开发者工具打开事件
    const devtoolsCheck = () => {
        if (checkDevTools()) {
            redirectSilently();
        }
    };
    
    // 添加多种事件监听确保检测
    window.addEventListener('resize', devtoolsCheck);
    window.addEventListener('mousemove', devtoolsCheck);
    window.addEventListener('focus', devtoolsCheck);
    window.addEventListener('blur', devtoolsCheck);
})();
