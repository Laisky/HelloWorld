(function() {
    var canvas = document.getElementById('myCanvas');

    // 创建画布
    var ctx = canvas.getContext('2d');

    // 绘制线条
    ctx.beginPath(); // 开始路径绘制
    ctx.moveTo(20, 20); // 设置路径起点，坐标为(20,20)
    ctx.lineTo(200, 20); // 绘制一条到(200,20)的直线
    ctx.lineWidth = 1.0; // 设置线宽
    ctx.strokeStyle = '#CC0000'; // 设置线的颜色
    ctx.stroke(); // 进行线的着色，这时整条线才变得可见

    // 绘制实心矩形
    // void ctx.fillRect(x, y, width, height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(20, 70, 180, 50);

    // 绘制空心矩形
    // void ctx.strokeRect(x, y, width, height);
    ctx.strokeRect(20, 170, 180, 50);

    // 清除矩形
    // void ctx.clearRect(x, y, width, height);
    ctx.clearRect(100, 10, 20, 500);

    // 绘制文本
    ctx.font = 'Bold 20px Arial'; // 设置字体
    ctx.textAlign = 'left'; // 设置对齐方式
    ctx.fillStyle = '#008600'; // 设置填充颜色
    ctx.fillText('Hello!', 20, 270); // 设置字体内容，以及在画布上的位置
    ctx.strokeText('Hello!', 120, 270); // 绘制空心字

    // 绘制圆形
    // void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    // 实心圆
    ctx.beginPath();
    ctx.arc(70, 370, 50, 0, Math.PI * 2, true);
    ctx.fillStyle = 'green';
    ctx.fill();

    // 空心圆
    ctx.beginPath();
    ctx.arc(70, 500, 50, 0, Math.PI * 2, true);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // 渐变色
    // CanvasGradient ctx.createLinearGradient(x0, y0, x1, y1);
    var myGradient = ctx.createLinearGradient(20, 600, 200, 650);
    myGradient.addColorStop(0, 'red');
    myGradient.addColorStop(1, 'blue');
    ctx.fillStyle = myGradient;
    ctx.fillRect(20, 600, 180, 50)

    // 阴影
    ctx.shadowOffsetX = 10; // 设置水平位移
    ctx.shadowOffsetY = 10; // 设置垂直位移
    ctx.shadowBlur = 5; // 设置模糊度
    ctx.shadowColor = 'grey'; // 设置阴影颜色
    ctx.fillRect(20, 600, 180, 50)
})()
