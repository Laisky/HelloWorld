var page = require('webpage').create();

// 发起请求
// 处理请求和返回
page.onResourceRequested = function(request) {
    console.log('Request ' + JSON.stringify(request, undefined, 4));
};
page.onResourceReceived = function(response) {
    console.log('Receive ' + JSON.stringify(response, undefined, 4));
};

page.open('http://www.douban.com');
phantom.exit();
