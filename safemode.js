document.addEventListener('DOMContentLoaded', function() {
    const safemodeCheckbox = document.getElementById('safemodeCheckbox');
    let isSafeModeEnabled = false;

    // 检查是否有存储的安全模式状态
    if (localStorage.getItem('isSafeModeEnabled') === 'true') {
        safemodeCheckbox.checked = true;
        isSafeModeEnabled = true;
        monitorPageVisibility(); // 如果复选框是选中的，启用监控
    }

    // 监听复选框的变动
    safemodeCheckbox.addEventListener('change', function() {
        isSafeModeEnabled = safemodeCheckbox.checked;
        localStorage.setItem('isSafeModeEnabled', isSafeModeEnabled); // 将状态存储到localStorage
        if (isSafeModeEnabled) {
            monitorPageVisibility(); // 启用安全模式时，监控页面可见性
        } else {
            restorePageContent(); // 关闭安全模式时，恢复页面内容
        }
    });

    let isPageVisible = true;

    // 监听页面是否可见
    document.addEventListener('visibilitychange', function() {
        isPageVisible = document.visibilityState === 'visible';
        if (isSafeModeEnabled && !isPageVisible) {
            blockPageContent(); // 如果在安全模式且页面不在前台，阻止页面显示
        }
    });

    function blockPageContent() {
        document.body.innerHTML = `
            <html lang="zh">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>THIS SITE IS BLOCKED!</title>
                <style>
                    body {
                        background-color: rgb(50, 98, 142); /* 背景颜色 */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        position: relative;
                    }
                    h1 {
                        font-size: 5rem;
                        color: white;
                        position: absolute;
                        top: 45%; 
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-weight: 50;
                    }
                </style>
            </head>
            <body>
                <h1>该网页已被阻止！</h1>
            </body>
            </html>
        `;
        document.body.addEventListener('dblclick', restorePageContent); // 双击恢复页面
    }

    function restorePageContent() {
        location.reload(); // 双击后，刷新恢复页面
    }

    // 监控页面可见性并启用安全模式
    function monitorPageVisibility() {
        if (!isPageVisible) {
            blockPageContent(); // 页面不在前台时阻止显示
        }
    }
});
