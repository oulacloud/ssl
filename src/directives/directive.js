import Vue from 'vue'

Vue.directive('watermark',{
    bind: function(el,binding) {
        const text = binding.value || '拿地宝';
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        canvas.width = el.offsetWidth;
        canvas.height = el.offsetHeight;

        context.font = '100px Arial';
        context.fillStyle = 'rgba(0,0,0,0.2)';

        context.rotate(-Math.PI/4)

        const xCount = Math.ceil(canvas.width / textWidth);
        const yCount = Math.ceil(canvas.height / (textHeight * 2));
        
        for (let i = 0; i <= xCount; i++) 
        {
            for (let j = 0; j <= yCount; j++) 
            {
                context.fillText(text, i * textWidth * 2, j * textHeight * 2);
            }
        }
        
        el.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
})


export { watermark }