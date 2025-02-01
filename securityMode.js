window.addEventListener('load', function () {
    const securityCheckbox = document.getElementById('security-mode');
    let securityEnabled = false;
    let originalContent = document.body.innerHTML;

    // 切换安全模式的状态
    securityCheckbox.addEventListener('change', function () {
        securityEnabled = securityCheckbox.checked;
        
        if (securityEnabled) {
            // 启用安全模式时，保存当前页面内容
            originalContent = document.body.innerHTML;
        } else {
            // 关闭安全模式时，恢复原页面内容
            document.body.innerHTML = originalContent;
        }
    });

    // 检测页面是否被隐藏（即标签页切换）
    document.addEventListener('visibilitychange', function () {
        if (securityEnabled && document.visibilityState === 'hidden') {
            // 标签页切换时，显示“网页已被阻止”内容
            document.body.innerHTML = `
                <div id="blocked-content" style="background-color: rgb(50, 98, 142);
                                                  display: flex; justify-content: center;
                                                  align-items: center; height: 100vh;
                                                  margin: 0; position: relative;">
                    <h1 style="font-size: 5rem; color: white; position: absolute;
                              top: 45%; left: 50%; transform: translate(-50%, -50%);
                              font-weight: 50;">该网页已被阻止！</h1>
                </div>
            `;
        }
    });

    // 双击恢复原内容
    document.body.addEventListener('dblclick', function () {
        if (securityEnabled) {
            document.body.innerHTML = originalContent;  // 恢复原来的内容
        }
    });
});
