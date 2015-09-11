(function() {
    var dataset = [250, 210, 170, 130, 90]; //数据（表示矩形的宽度）
    var svg = d3.select('svg');
    var rectHeight = 25;

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr("x", 20)
        .attr("y", function(d, i) {
            return i * rectHeight;
        })
        .attr("width", function(d) {
            return d;
        })
        .attr("height", rectHeight - 2)
        .attr("fill", "steelblue");
})()
