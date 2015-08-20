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
     * app 1: expression
     */
    (function() {
        // 普通 expression
        let source = $('#tpl-exp').html();
        let template = Handlebars.compile(source);
        let html = template(globalContext);
        $('#exp-1').html(html);
    })();


    /**
     * app 2: escape
     */
    (function() {
        // without escape
        let source = $('#tpl-escape').html();
        let template = Handlebars.compile(source);
        let html = template(globalContext);
        $('#escape-1').html(html)
    })();

})();
