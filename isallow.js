var isallow = 0;

var allowedDomains = [
    "https://huzhonghe2011.github.io/",
    "https://huzhonghe2011.pages.dev/",
    "https://main.qwert114.us.kg/"
];

var referrer = window.location.href;

if (Number(isallow) === 0 && !allowedDomains.some(function(domain) {
    return referrer.includes(domain);
})) {
    alert("原作者拒绝加载");
    window.location.href = "about:blank";
}
