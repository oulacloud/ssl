<template>
    <div v-drag class="drag-title">
        <span class="MyTitle" :style="{ '--size': title_text_size + 'px', '--bold': title_text_bold, '--color': title_text_color, '--bgcolor': title_bg_color }">
            {{ this.title }}
        </span>
    </div>
</template>


<script>
import '../../GaoDePage/GaoDeJS/drag'
export default {
    props: {
        // stylelist: null,
        title: null,
        title_text_size: null,
        title_text_bold: null,
        title_text_color: null,
        title_bg_color: null,
    },
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
    }


}
</script>


<style >
.drag-title {
    /* width: 100px; */
    /* height: 25; */
    background: rgb(255, 255, 255);
    position: relative;
    z-index: 100;
    white-space: nowrap;
    /* width: auto; */
    display: inline-block !important;
    /* display: inline; */
}

.MyTitle {
    font-size: var(--size);
    font-weight: var(--bold);
    color: var(--color);
    background-color: var(--bgcolor);
    -webkit-user-select: none;
    /*webkit浏览器*/
    -moz-user-select: none;
    /*火狐*/
    -ms-user-select: none;
    /*IE10*/
    user-select: none;
}
</style>