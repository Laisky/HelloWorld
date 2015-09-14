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

    /**
     * update & enter & exit
     * update 表示元素和数据匹配的部分
     * enter 表示数据比元素多的部分
     * exit 表示数据比元素多的部分
     */
    var dataset = [1, 2, 3];
    var p = d3.select('section.update').selectAll('p');
    // 获取 update
    var update = p.data(dataset);
    var enter = update.enter();
    var exit = update.exit();
    // 处理
    update.text(function(d) {
        return 'update ' + d;
    })
    enter.append('p').text(function(d) {
        return 'enter ' + d;
    })
    exit.remove();

    /**
     * 事件
     * click：鼠标单击某元素时，相当于 mousedown 和 mouseup 组合在一起。
     * mouseover：光标放在某元素上。
     * mouseout：光标从某元素上移出来时。
     * mousemove：鼠标被移动的时候。
     * mousedown：鼠标按钮被按下。
     * mouseup：鼠标按钮被松开。
     * dblclick：鼠标双击。
     */
    function mouseMoveHandler() {
        x = d3.event.offsetX;
        y = d3.event.offsetY;
        d3.select(this)
            // .transition()
            .attr({
                cx: x,
                cy: y
            });

    }

    circle.on('mousemove', mouseMoveHandler);

})()
