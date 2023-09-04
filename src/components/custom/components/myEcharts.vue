<template>
    <div v-drag class="drag-leng" :style="{ '--bgcolor': leng_bg_color, '--heg': this.heg }">
        <div v-resize="DomResize" :id="1">
            <div ref="init" v-for="index in this.len" :key="index" class="drag-leng-inner">
                <span
                    :style="{ 'background-color': color(index), '--heg': leng_font_size + 'px', '--wid': leng_font_size * 5 / 3 + 'px' }"
                    class="drag-leng-left"></span>
                <span class="drag-leng-right" :style="{ '--size': leng_font_size + 'px', '--color': leng_text_color }">{{
                    range(index) }}</span>
            </div>
        </div>
    </div>
</template>


<script>
import '../../GaoDePage/GaoDeJS/drag'
export default {
    props: {
        colorlist: Array,
        datalist: Array,
        flag: Number, // 控制单位
        leng_font_size: null,
        leng_text_color: null,
        leng_bg_color: null,
    },
    data() {
        return {
            len: null,
            heg: null,
        }
    },
    directives: {
        resize: {
            // 指令的名称
            bind(el, binding) {
                // el为绑定的元素，binding为绑定给指令的对象
                // console.log(el, '绑定', binding)
                let height = ''
                let targetId = ''
                function isReize() {
                    const style = document.defaultView.getComputedStyle(el)
                    if (height !== style.height) {
                        binding.value({ height: style.height, targetId: el.id })
                    }
                    height = style.height
                }
                el.__vueSetInterval__ = setInterval(isReize, 300)
            },
            unbind(el) {
                // console.log(el, '解绑')
                clearInterval(el.__vueSetInterval__)
            }
        }
    },
    methods: {
        range(index) {
            if (this.flag == 0) {
                var str = ''
            }
            else {
                var str = '%'
            }
            var i = index - 1
            if (i == 0) {
                return '<' + this.datalist[i] + str;
            }
            else if (i == this.datalist.length) {
                return '>' + this.datalist[i - 1] + str;
            }
            else {
                return this.datalist[i - 1] + str + '-' + this.datalist[i] + str;
            }
        },
        color(index) {
            var color = this.colorlist[index - 1]
            return color
        },
        DomResize(data) {
            // console.log('height:', data.height, '   需要监听的dom高度改变')
            this.heg = data.height
            // console.log(this.heg)
        },
    },
    mounted() {
        // console.log(this.datalist)
        this.len = this.datalist.length + 1
        // this.$nextTick(() => {
        //     const element = this.$refs.init.$el;
        //     const styles = window.getComputedStyle(element);
        //     const height = styles.getPropertyValue('height');
        //     console.log(height)
        //     // this.heg = height
        // })
    },

}
</script>


<style >
.drag-leng {
    /* width: 100px; */
    height: var(--heg);
    background: var(--bgcolor);
    border-radius: 5px;
    left: 20px;
    bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
    position: absolute;
    z-index: 100;
    white-space: nowrap;
    /* width: auto; */
    display: inline-block !important;
    /* display: inline; */
}

.drag-leng-inner {
    -webkit-user-select: none;
    /*webkit浏览器*/
    -moz-user-select: none;
    /*火狐*/
    -ms-user-select: none;
    /*IE10*/
    user-select: none;
}

.drag-leng-left {
    width: var(--wid);
    height: var(--heg);
    line-height: var(--heg);
    margin-top: 5px;
    margin-left: 5px;
    display: inline-flex;
    opacity: 1;
}

.drag-leng-right {
    color: var(--color);
    font-size: var(--size);
}
</style>