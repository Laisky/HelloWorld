(function() {
    /**
     * 简单
     * Demo
     *
     * 矩形 <rect>
     * 圆形 <circle>
     * 椭圆 <ellipse>
     * 线段 <line>
     * 折线 <polyline>
     * 多边形 <polygon>
     */
    var dataset = [250, 210, 170, 130, 90]; //数据（表示矩形的宽度）
    var svg = d3.select('svg.app1');
    var rectHeight = 25;

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', 20)
        .attr('y', function(d, i) {
            return i * rectHeight;
        })
        .attr('width', function(d) {
            return d;
        })
        .attr('height', rectHeight - 2)
        .attr('fill', 'steelblue');

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
    // 112.5
    //
    // 序数比例尺
    var colors = ['red', 'blue', 'green', 'yellow', 'black'];
    var ordinal = d3.scale.ordinal()
        .domain(dataset)
        .range(colors);
    var svg = d3.select('svg.app2');

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', 20)
        .attr('y', function(d, i) {
            return i * rectHeight;
        })
        .attr('width', function(d) {
            return linear(d);
        })
        .attr('height', rectHeight - 2)
        .attr('fill', 'grey');


    /**
     * 坐标轴 d3.axis
     */
    var axis = d3.svg.axis()
        .scale(linear) // 指定比例尺
        .orient('bottom')
        .ticks(7) // 刻度
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(20,100)')
        .call(axis);

    /**
     * transition
     */
    var svg = d3.select('svg.app3');
    var circle = svg.append('circle')
        .attr({
            cx: 40,
            cy: 20,
            r: 20
        })
        .style({
            fill: 'green'
        });
    // 移动变化
    circle.transition()
        .duration(1500)
        .attr({
            cx: 200
        })
        // linear：普通的线性变化
        // circle：慢慢地到达变换的最终状态
        // elastic：带有弹跳的到达最终状态
        // bounce：在最终状态处弹跳几次
        .ease("bounce")
        .style({
            fill: 'red'
        });

})()
