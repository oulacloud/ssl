<template>
    <div class="content4">
      <div class="tz_block" 
      @dragstart="getMouseDown"
      @drag="getMouseMove($event)"
      @dragend="getMouseUp" draggable="true"
      :style="{
      transform:
      type=='top-left'?`translateX(${endPoint.x-startPoint.x}px) translateY(${endPoint.y-startPoint.y}px)`:
      type=='top'?`translateY(${endPoint.y-startPoint.y}px)`:
      type=='top-right'?`translateY(${endPoint.y-startPoint.y}px)`:
      type=='left'?`translateX(${endPoint.x-startPoint.x}px)`:
      type=='right'?``:
      type=='bottom-left'?`translateX(${endPoint.x-startPoint.x}px)`:
      type=='bottom'?``:
      type=='bottom-right'?``:
      `translateX(${endPoint.x-startPoint.x}px) translateY(${endPoint.y-startPoint.y}px)`,
      left:left+'px',top:top+'px',
      width:
      type=='top-left'?width-(endDrag.x-startDrag.x)+'px'
      :type=='top'?width+'px'
      :type=='top-right'?width+(endDrag.x-startDrag.x)+'px'
      :type=='left'?width-(endDrag.x-startDrag.x)+'px'
      :type=='right'?width+(endDrag.x-startDrag.x)+'px'
      :type=='bottom-left'?width-(endDrag.x-startDrag.x)+'px'
      :type=='bottom'?width+'px'
      :type=='bottom-right'?width+(endDrag.x-startDrag.x)+'px'
      :width+'px',
      height:
      type=='top-left'?height-(endDrag.y-startDrag.y)+'px'
      :type=='top'?height-(endDrag.y-startDrag.y)+'px'
      :type=='top-right'?height-(endDrag.y-startDrag.y)+'px'
      :type=='left'?height+'px'
      :type=='right'?height+'px'
      :type=='bottom-left'?height+(endDrag.y-startDrag.y)+'px'
      :type=='bottom'?height+(endDrag.y-startDrag.y)+'px'
      :type=='bottom-right'?height+(endDrag.y-startDrag.y)+'px'
      :height+'px',}">
        <span class="lock top-left"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'top-left')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock top"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'top')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock top-right"
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'top-right')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock left"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'left')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock right"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'right')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock bottom-left"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'bottom-left')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock bottom"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'bottom')"
        @dragend.stop="dragend" draggable="true"></span>
        <span class="lock bottom-right"  
        @dragstart.stop="dragstart"
        @drag.stop="drag($event,'bottom-right')"
        @dragend.stop="dragend" draggable="true"></span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name:'生成二维码',
    data() {
      return {
        startPoint:{x:0,y:0},//开始坐标
        endPoint:{x:0,y:0},//结束坐标
        moveFlag:false,
        left:600,
        top:100,
        width:200,
        height:100,
        startDrag:{x:0,y:0},
        endDrag:{x:0,y:0},
        type:'',
      };
    },
    methods: {
       // 鼠标按下
      getMouseDown() {	
        let event;				// 浏览器事件记录起始位置
        event = event || window.event
        this.startPoint.x  = event.pageX;
        this.startPoint.y = event.pageY;
        this.endPoint.x = event.pageX;
        this.endPoint.y = event.pageY;	
        this.moveFlag = true;
        console.log('start',event.pageX,event.pageY); 
      },
      // 鼠标移动
      getMouseMove(e) {
        this.endPoint.y = e.pageY;
        this.endPoint.x = e.pageX;
        console.log('move',e.pageX,e.pageY); 
        this.type = '';
      },
      // 鼠标抬起 计算提示弹窗的位置
      getMouseUp() {
        this.moveFlag = false;
        let event;
        event = event || window.event;
        this.endPoint.y = event.pageY;
        this.endPoint.x = event.pageX;
        console.log('end',event.pageX,event.pageY); 
        let tz_block = document.querySelector('.tz_block');
        tz_block.style.left = this.left+(this.endPoint.x-this.startPoint.x)+'px';
        tz_block.style.top = this.top+(this.endPoint.y-this.startPoint.y)+'px';
        console.log('tz_block',tz_block,this.startPoint,this.endPoint);
        this.left = this.left+(this.endPoint.x-this.startPoint.x);
        this.top = this.top+(this.endPoint.y-this.startPoint.y);
 
        this.$nextTick(()=>{
          this.startPoint.x  = event.pageX;
          this.startPoint.y = event.pageY;
          this.endPoint.x = event.pageX;
          this.endPoint.y = event.pageY;	
        })
      },
        // 鼠标按下
      dragstart() {
        let event;				// 浏览器事件记录起始位置
        event = event || window.event
        this.startDrag.x  = event.pageX;
        this.startDrag.y = event.pageY;
        this.endDrag.x = event.pageX;
        this.endDrag.y = event.pageY;	
        console.log('start',event.pageX,event.pageY); 
        this.startPoint.x  = event.pageX;
        this.startPoint.y = event.pageY;
        this.endPoint.x = event.pageX;
        this.endPoint.y = event.pageY;	
      },
      // 鼠标移动
      drag(e,type) {
        
        this.endDrag.y = e.pageY;
        this.endDrag.x = e.pageX;
 
        this.endPoint.y = e.pageY;
        this.endPoint.x = e.pageX;
        console.log('move',e.pageX,e.pageY,type); 
        this.type = type;
      },
      // 鼠标抬起 计算提示弹窗的位置
      dragend() {
        let event;
        event = event || window.event;
        this.endDrag.y = event.pageY;
        this.endDrag.x = event.pageX;
 
        this.endPoint.y = event.pageY;
        this.endPoint.x = event.pageX;
        console.log('end',event.pageX,event.pageY); 
       
 
        if(this.type=='top-left'){
          let tz_block = document.querySelector('.tz_block');
          tz_block.style.left = this.left+(this.endPoint.x-this.startPoint.x)+'px';
          tz_block.style.top = this.top+(this.endPoint.y-this.startPoint.y)+'px';
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
          this.left = this.left+(this.endPoint.x-this.startPoint.x);
          this.top = this.top+(this.endPoint.y-this.startPoint.y);
 
          this.width = this.width-(this.endDrag.x-this.startDrag.x);
          this.height = this.height-(this.endDrag.y-this.startDrag.y);
        }else if(this.type=='top'){
          let tz_block = document.querySelector('.tz_block');
          tz_block.style.top = this.top+(this.endPoint.y-this.startPoint.y)+'px';
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
          this.top = this.top+(this.endPoint.y-this.startPoint.y);
 
          this.height = this.height-(this.endDrag.y-this.startDrag.y);
        }else if(this.type=='top-right'){
          let tz_block = document.querySelector('.tz_block');
          tz_block.style.top = this.top+(this.endPoint.y-this.startPoint.y)+'px';
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
          this.top = this.top+(this.endPoint.y-this.startPoint.y);
 
          this.width = this.width+(this.endDrag.x-this.startDrag.x);
          this.height = this.height-(this.endDrag.y-this.startDrag.y);
        }else if(this.type=='left'){
          let tz_block = document.querySelector('.tz_block');
          tz_block.style.left = this.left+(this.endPoint.x-this.startPoint.x)+'px';
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
          this.left = this.left+(this.endPoint.x-this.startPoint.x);
          this.width = this.width-(this.endDrag.x-this.startDrag.x);
        }else if(this.type=='right'){
          let tz_block = document.querySelector('.tz_block');
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
 
          this.width = this.width+(this.endDrag.x-this.startDrag.x);
        }else if(this.type=='bottom-left'){
          let tz_block = document.querySelector('.tz_block');
          tz_block.style.left = this.left+(this.endPoint.x-this.startPoint.x)+'px';
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
          this.left = this.left+(this.endPoint.x-this.startPoint.x);
 
          this.width = this.width-(this.endDrag.x-this.startDrag.x);
          this.height = this.height+(this.endDrag.y-this.startDrag.y);
        }else if(this.type=='bottom'){
          let tz_block = document.querySelector('.tz_block');
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
 
          this.height = this.height+(this.endDrag.y-this.startDrag.y);
        }else if(this.type=='bottom-right'){
          let tz_block = document.querySelector('.tz_block');
          console.log('tz_block',tz_block,this.startPoint,this.endPoint);
 
          this.width = this.width+(this.endDrag.x-this.startDrag.x);
          this.height = this.height+(this.endDrag.y-this.startDrag.y);
        }
        this.$nextTick(()=>{
          this.startDrag.x  = event.pageX;
          this.startDrag.y = event.pageY;
          this.endDrag.x = event.pageX;
          this.endDrag.y = event.pageY;	
 
          this.startPoint.x  = event.pageX;
          this.startPoint.y = event.pageY;
          this.endPoint.x = event.pageX;
          this.endPoint.y = event.pageY;	
        })
      }
    },
    mounted() {
    },
  };
  </script>
  
  
  <style scoped lang="less">
  .content4{
    position: relative;
  }
  .tz_block{
    background-color: red;
    position: absolute;
    cursor: move;
    // border: 1px solid #000;
    .lock{
      width: 2px;
      height: 2px;
      border: 2px solid #2db7f5;
      border-radius: 50%;
      position: absolute;
      box-sizing: border-box;
      background-color: #fff;
      z-index: 2;
    }
      .top-left{
        left: -5px;
        top: -5px;
        cursor: nw-resize;
      }
      .top{
        top: -5px;
        left: 50%;
        transform:translateX(-50%);
        cursor: n-resize;
      }
      .top-right{
        right: -5px;
        top: -5px;
        cursor: ne-resize;
      }
      .left{
        left: -5px;
        top: 50%;
        transform:translateY(-50%);
        cursor: ew-resize;
      }
      .right{
        right: -5px;
        top: 50%;
        transform:translateY(-50%);
        cursor: ew-resize;
      }
      .bottom-left{
        left: -5px;
        bottom: -5px;
        cursor: ne-resize;
      }
      .bottom{
        bottom: -5px;
        left: 50%;
        transform:translateX(-50%);
        cursor: n-resize;
      }
      .bottom-right{
        right: -5px;
        bottom: -5px;
        cursor: nw-resize;
      }
      .line{
        position: absolute;
        cursor: move;
      }
      .line-top{
        left: 0;
        right: 0;
        top: -5px;
        height: 5px;
        border-bottom: 1px solid #999;
      }
      .line-left{
        left: -5px;
        top: 0;
        bottom: 0;
        width: 5px;
        border-right: 1px solid #999;
      }
      .line-right{
        bottom: 0;
        right: -5px;
        top: 0;
        width: 5px;
        border-left: 1px solid #999;
      }
      .line-bottom{
        left: 0;
        right: 0;
        bottom: -5px;
        height: 5px;
        border-top: 1px solid #999;
      }
  }
  </style>