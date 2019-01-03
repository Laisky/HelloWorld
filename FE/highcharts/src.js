(function() {
    $('#container').highcharts({ //图表展示容器，与div的id保持一致
        chart: {
            type: 'column' //指定图表的类型，默认是折线图（line）
        },
        title: {
            text: 'My first Highcharts chart' //指定图表标题
        },
        xAxis: {
            categories: ['my', 'first', 'chart'] //指定x轴分组
        },
        yAxis: {
            title: {
                text: 'something' //指定y轴的标题
            }
        },
        series: [{ //指定数据列
            name: 'Jane', //数据列名
            data: [1, 0, 4] //数据
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
})()
