// 创建一个页面实例
var page = require('webpage').create();


// 获取网页沙盒的 console 信息
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// 浏览器窗口大小
page.viewportSize = { width: 800, height: 800 };
// 显示区域
page.clipRect = { top: 0, left: 0, width: 800, height: 500 };

f = (new Date()).getTime()

// 请求一个页面
page.open('https://www.baidu.com', function(status) {
    console.log("Status: " + status);
    if (status === "success") {
        // 若成功则截图
        // 可以保存为 jpg, png, gif, pdf
        page.render('example.png');

        // page.evaluate 可以在页面内执行 js 代码
        var title = page.evaluate(function() {
            return document.title;
        });
        console.log('Page title is ' + title);

        // 可以打开页面后，引入外部库
        page.includeJs("http://cdn.staticfile.org/jquery/2.2.1/jquery.min.js", function() {
            page.evaluate(function() {
                console.log('执行 js 脚本...')
                $('input.s_ipt').val('透明');
                $('input.s_ipt').parents('form').submit();
            });
        });

        // 加载时异步的
        // 所以要把退出语句写进来
        page.onLoadFinished = function(status) {
            console.log('Load Finished: ' + status);
            console.log('Cost: ' + ((new Date()).getTime() - f) + 'ms')
            page.render("search.png");
            phantom.exit();
        };
    }
});