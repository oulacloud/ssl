<template>
    <div class="dashboard">
    <div class="flex-container column">
        <div
          class="item one"
          @click="clickChart('1')"
          style="transform: translate(-22.4%, -33.5%) scale(0.33)"
        >
          <BarCharts />
        </div>
  
        <div
          class="item two"
          @click="clickChart('2')"
          style="transform: translate(-22.4%, 0.5%) scale(0.33)"
        >
          <LineCharts />
        </div>
        <div
          class="item three"
          @click="clickChart('3')"
          style="transform: translate(-22.4%, 34.5%) scale(0.33)"
        >
          <BarCharts />
        </div>
        <div
          class="item four active"
          @click="clickChart('4')"
          style="transform: translate(43.7%, 0) scale(1)"
        >
          <LineCharts />
        </div>
      </div>



    </div>
</template>
  
<script>
import BarCharts from "./components/BarCharts.vue";
import LineCharts from "./components/LineCharts.vue";

export default {
    data() {
        return {
            items: [],
            canvas: null,
            context: null,
            isDrawing: false,
            points: []
        };
    },
    mounted() {
        // this._init();

        this.canvas = this.$refs.canvas;
        this.context = this.canvas.getContext('2d');
    },
    methods: {
        _resize() {
            this.$root.charts.forEach((myChart) => {
                myChart.resize();
            });
        },
        _init() {
            this.items = document.querySelectorAll(".flex-container .item");
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].dataset.order = i + 1;
            }
        },
        clickChart(clickIndex) {
            let activeItem = document.querySelector(".flex-container .active");
            let activeIndex = activeItem.dataset.order;
            let clickItem = this.items[clickIndex - 1];
            if (activeIndex === clickIndex) {
                return;
            }
            activeItem.classList.remove("active");
            clickItem.classList.add("active");
            this._setStyle(clickItem, activeItem);
        },
        _setStyle(el1, el2) {
            let transform1 = el1.style.transform;
            let transform2 = el2.style.transform;
            el1.style.transform = transform2;
            el2.style.transform = transform1;
        },
        startDrawing(event) {
            this.isDrawing = true;
            const { offsetX, offsetY } = event;
            this.points.push({ x: offsetX, y: offsetY });
            console.log(this.points)
        },
        draw(event) {
            if (!this.isDrawing) return;
            const { offsetX, offsetY } = event;
            this.points.push({ x: offsetX, y: offsetY });
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPolygon();
        },
        endDrawing() {
            this.isDrawing = false;
        },
        drawPolygon() {
            this.context.beginPath();
            this.context.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                const { x, y } = this.points[i];
                this.context.lineTo(x, y);
            }
            this.context.closePath();
            this.context.stroke();
        }
    },
    components: {
        BarCharts,
        LineCharts,
    },
};
</script>
  
<style  scoped>
canvas {
    border: 1px solid #000;
}

* {
    box-sizing: border-box;
}

/* .BarCharts {
    height: 100% !important;
    width: 100% !important;
    background: none !important;
  } */
.item {
    padding: 0px;
    margin: 0px;
    width: 68%;
    height: 100%;
    position: absolute;
    transform: scale(0.33);
    text-align: center;
    transition: all 0.8s;
    background: rgba(32, 32, 35, 0.5);
}

.dashboard {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    padding-top: 0.1%;
    /* background: url("../../../static/bg.jpg"); */
    background-size: 100% 100%;
}

.flex-container.column {
    position: relative;
    height: 90%;
    width: 90%;
    overflow: hidden;
    margin: 0 auto 100px auto;
    box-sizing: content-box;
}

.active {
    height: 100%;
    width: 69%;
    margin-left: 10px;
    line-height: 300px;
}</style>
  