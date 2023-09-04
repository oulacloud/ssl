//创建一个js文件 directive.js
import Vue from "vue";
Vue.directive("drag", {
    bind: function (el) {
        let odiv = el
        // odiv.style.position = "fixed"
        odiv.onmousedown = (e) => {
            let disX = e.clientX - odiv.offsetLeft
            let disY = e.clientY - odiv.offsetTop
            document.onmousemove = (e) => {
                let left = e.clientX - disX
                let top = e.clientY - disY
                odiv.style.left = left + "px"
                odiv.style.top = top + "px"
            }
            document.onmouseup = () => {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    },
})