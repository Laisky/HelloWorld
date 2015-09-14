(function() {
    /**
     * 简单
     * Demo
     */
    var dataset = [250, 210, 170, 130, 90]; //数据（表示矩形的宽度）
    var svg = d3.select('svg');
    var rectHeight = 25;

    // svg.selectAll('rect')
    //     .data(dataset)
    //     .enter()
    //     .append('rect')
    //     .attr('x', 20)
    //     .attr('y', function(d, i) {
    //         return i * rectHeight;
    //     })
    //     .attr('width', function(d) {
    //         return d;
    //     })
    //     .attr('height', rectHeight - 2)
    //     .attr('fill', 'steelblue');

    /**
     * 比例尺工具
     */
    //
    // 线性比例尺
    // 将数据集映射到 0-300
    var linear = d3.scale.linear()
        // domain 参数的数量和 range 对应
        .domain([d3.min(dataset), d3.max(dataset)])
        .range([0, 300]);
    console.log(linear(150));
    // 112.5
    //
    // 序数比例尺
    var colors = ['red', 'blue', 'green', 'yellow', 'black'];
    var ordinal = d3.scale.ordinal()
        .domain(dataset)
        .range(colors);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', 20)
        .attr('y', function(d, i) {
            return i * rectHeight + 150;
        })
        .attr('width', function(d) {
            return linear(d);
        })
        .attr('height', rectHeight - 2)
        .attr('fill', 'grey');
})()