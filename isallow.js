var isallow = 1;

var allowedDomains = [
    "https://huzhonghe2011.github.io/",
    "https://huzhonghe2011.pages.dev/",
    "https://main.qwert114.us.kg/"
];

// 获取 document.referrer，避免为空
var referrer = document.referrer || '';

// 确保 isallow 为数字，避免类型错误
if (Number(isallow) === 0 && !allowedDomains.some(function(domain) {
    // 使用 includes 以更宽松的方式检查 referrer 中是否包含 domain
    return referrer.includes(domain);
})) {
    alert("原作者拒绝加载");
    window.location.href = "about:blank";
}
