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
        .ease('bounce')
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
    circle.on('mouseover', function() {
        d3.select(this)
            .transition()
            .duration(500)
            .style({
                fill: 'gold'
            })
    });
    circle.on('mouseout', function() {
        d3.select(this)
            .transition()
            .duration(500)
            .style({
                fill: 'green'
            })
    })

    /**
     * drag
     */
    var drag = d3.behavior.drag()
        .on('drag', dragmove);

    function dragmove(d) {
        var $this = d3.select(this);
        $this
            .attr('cx', $this.cx = d3.event.x)
            .attr('cy', $this.cy = d3.event.y)
            .attr('x', $this.cx = d3.event.x)
            .attr('y', $this.cy = d3.event.y);
    }
    circle.call(drag);


    /**
     * Topo
     */
    var width = 300,
        height = 300;
    var dataset = {
        nodes: [{
            name: 'laisky1',
            image: './head.jpg'
        }, {
            name: 'laisky2',
            image: './head.jpg'
        }],
        edges: [{
            source: 0,
            target: 1,
            relation: 'conjugate'
        }]
    };
    var img_w = 50;
    var img_h = 50;
    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    /**
     * 箭头
     */
    var defs = svg.append('defs');

    var arrowMarker = defs.append('marker')
        .attr('id', 'arrow')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '12')
        .attr('markerHeight', '12')
        .attr('viewBox', '0 0 12 12')
        .attr('refX', '6')
        .attr('refY', '6')
        .attr('orient', 'auto');

    var arrow_path = 'M2,2 L10,6 L2,10 L6,6 L2,2';

    arrowMarker.append('path')
        .attr('d', arrow_path)
        .attr('fill', '#000');

    // topo
    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([width, height])
        .linkDistance(200)
        .charge(-100)
        .start();

    // 连线
    var edges_line = svg.selectAll('line')
        .data(dataset.edges)
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)')
        .attr('marker-start', 'url(#arrow)');

    // 连线文字
    var edges_text = svg.selectAll('.linetext')
        .data(dataset.edges)
        .enter()
        .append('text')
        .attr('class', 'linetext')
        .text(function(d) {
            return d.relation;
        });

    // 节点
    var nodes_img = svg.selectAll('image')
        .data(dataset.nodes)
        .enter()
        .append('image')
        .attr('width', img_w)
        .attr('height', img_h)
        .attr('xlink:href', function(d) {
            return d.image;
        })
        .on('mouseover', function(d, i) {
            //显示连接线上的文字
            edges_text.style('fill-opacity', function(edge) {
                if (edge.source === d || edge.target === d) {
                    return 1.0;
                }
            });
        })
        .on('mouseout', function(d, i) {
            //隐去连接线上的文字
            edges_text.style('fill-opacity', function(edge) {
                if (edge.source === d || edge.target === d) {
                    return 0.0;
                }
            });
        })
        .call(force.drag);

    var text_dx = -20;
    var text_dy = 20;

    var nodes_text = svg.selectAll('.nodetext')
        .data(dataset.nodes)
        .enter()
        .append('text')
        .attr('class', 'nodetext')
        .attr('dx', text_dx)
        .attr('dy', text_dy)
        .text(function(d) {
            return d.name;
        });


    force.on('tick', function() {

        //限制结点的边界
        dataset.nodes.forEach(function(d, i) {
            d.x = d.x - img_w / 2 < 0 ? img_w / 2 : d.x;
            d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
            d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
            d.y = d.y + img_h / 2 + text_dy > height ? height - img_h / 2 - text_dy : d.y;
        });

        //更新连接线的位置
        edges_line.attr('x1', function(d) {
            return d.source.x;
        });
        edges_line.attr('y1', function(d) {
            return d.source.y;
        });
        edges_line.attr('x2', function(d) {
            return d.target.x;
        });
        edges_line.attr('y2', function(d) {
            return d.target.y;
        });

        //更新连接线上文字的位置
        edges_text.attr('x', function(d) {
            return (d.source.x + d.target.x) / 2;
        });
        edges_text.attr('y', function(d) {
            return (d.source.y + d.target.y) / 2;
        });


        //更新结点图片和文字
        nodes_img.attr('x', function(d) {
            return d.x - img_w / 2;
        });
        nodes_img.attr('y', function(d) {
            return d.y - img_h / 2;
        });

        nodes_text.attr('x', function(d) {
            return d.x
        });
        nodes_text.attr('y', function(d) {
            return d.y + img_w / 2;
        });
    });
})()
