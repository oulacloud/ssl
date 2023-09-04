module.exports = {
    //添加水印
    initWatermark() {
        // 创建一个canvas
        const canvas = document.createElement('canvas');
        // 设置画布的宽高
        canvas.width = 300;
        canvas.height = 300;
        // 获取画笔
        const ctx = canvas.getContext('2d');
        // 水印，水印实际上就是将文字添加到画布上
        ctx.font = '50px Arial'; // 设置字体大小和字体
        ctx.rotate(-0.4);// 设置文字旋转角度
  
        // 创建实体水印
        // ctx.fillStyle = 'rgba(0,0,0,.3)'; // 颜色
        // ctx.fillText('拿地宝', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量
  
        //创建虚心水印
        ctx.strokeStyle = 'rgba(0,0,0,.2)';
        ctx.strokeText('数视灵', canvas.width / 6, canvas.height / 2);
  
        // 渐变水印
        // const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        // gradient.addColorStop(0, 'red');
        // gradient.addColorStop(0.5, 'yellow');
        // gradient.addColorStop(1, 'green');
        // ctx.fillStyle = gradient; // 颜色
        // ctx.fillText('拿地宝', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量
  
        // 将画布转成图片
        const img = canvas.toDataURL();
        const main = document.querySelector('.mainbox');
        main.style.backgroundImage = `url(${img})`;
      },
}