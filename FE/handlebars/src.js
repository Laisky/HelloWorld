(function() {
    "use strict";

    const globalContext = {
        name: '<h2>Laisky</h2>',
        info: {
            'title': 'king',
            'location': 'kings landing'
        },
        weapons: ['knife', 'gun']
    };

    /**
     * 渲染并填充
     */
    function renderTemplate(sourceId, targetId, context) {
        context = context || globalContext;
        let source = $('#' + sourceId).html();
        let template = Handlebars.compile(source);
        let html = template(context);
        $('#' + targetId).html(html);
    }


    /**
     * app 1: expression
     */
    renderTemplate('tpl-exp', 'exp-1');


    /**
     * app 2: escape
     */
    renderTemplate('tpl-escape', 'escape-1');


    /**
     * app3: helper
     */
    // 简单的 helper
    Handlebars.registerHelper('my-helper', function(options) {
        return options.fn({
            body: '毛也没有'
        });
    });
    renderTemplate('tpl-helper', 'helper');

    // helper wrapper
    Handlebars.registerHelper('my-helper-wrapper', function(options) {
        return '<p style="color: red;">' + options.fn(this) + '</p>';
    })
    renderTemplate('tpl-helper-wrapper', 'helper-wrapper');

    // 包含 with 的 helper
    Handlebars.registerHelper('my-helper-with', function(options) {
        let context = {
            title: '我是标题党',
            content: {
                name: '看板娘',
                sex: '妹纸'
            }
        };
        return options.fn(context);
    });
    renderTemplate('tpl-helper-with', 'helper-with');

    /**
     * helper each
     * helper 可以有参数，有参数的时候，options 是最后一个参数
     * 实现 each 的思路：
     *   options.fn 会返回 filter 包含的区域，
     *   所以在一个循环内调用 options.fn，就可以创建一个简单的 iterator 了。
     */
    Handlebars.registerHelper('my-helper-each', function(context, options) {
        let ret = '';
        for (let i = 0; i < context.length; i++) {
            ret += options.fn({
                content: context[i]
            });
        }
        return ret;
    });
    renderTemplate('tpl-helper-each', 'helper-each');

})();
