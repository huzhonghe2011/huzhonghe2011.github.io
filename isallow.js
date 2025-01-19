var isallow = 0;

var allowedDomains = [
    "https://huzhonghe2011.github.io/",
    "https://huzhonghe2011.pages.dev/",
    "https://main.qwert114.us.kg/"
];

var referrer = document.referrer;

if (isallow === 0 && !allowedDomains.some(function(domain) {
    return referrer.startsWith(domain);
})) {
    alert("原作者拒绝加载");
    window.location.href = "about:blank";
}
