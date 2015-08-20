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

    // helper each
    renderTemplate('tpl-helper-each', 'helper-each');

})();
