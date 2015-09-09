(function() {
    var canvas = document.getElementById('myCanvas');

    // 创建画布
    var ctx = canvas.getContext('2d');

    // 绘制线条
    ctx.beginPath(); // 开始路径绘制
    ctx.moveTo(20, 20); // 设置路径起点，坐标为(20,20)
    ctx.lineTo(200, 20); // 绘制一条到(200,20)的直线
    ctx.lineWidth = 1.0; // 设置线宽
    ctx.strokeStyle = "#CC0000"; // 设置线的颜色
    ctx.stroke(); // 进行线的着色，这时整条线才变得可见

    // 绘制实心矩形
    ctx.fillStyle = 'yellow';
    ctx.fillRect(20, 70, 180, 50);

    // 绘制空心矩形
    ctx.strokeRect(20, 170, 180, 50);

    // 清除矩形
    ctx.clearRect(100, 10, 20, 500);

    // 绘制文本
    // 设置字体
    ctx.font = "Bold 20px Arial";
    // 设置对齐方式
    ctx.textAlign = "left";
    // 设置填充颜色
    ctx.fillStyle = "#008600";
    // 设置字体内容，以及在画布上的位置
    ctx.fillText("Hello!", 20, 270);
    // 绘制空心字
    ctx.strokeText("Hello!", 120, 270);
})()
