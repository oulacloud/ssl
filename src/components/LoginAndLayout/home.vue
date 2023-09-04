<style>
.el-main {
  background-color: #f5f7f9;
}

.el-header {
  background-color: #d6d6d6;
  color: #333;
  line-height: 60px;
}

.el-container {
  height: 100%;
}

/* 进入后和离开前保持原位 */
.fade-right-enter,
.fade-right-leave {
  opacity: 1;
  transform: none;
}

/* 设置进入和离开过程中的动画时长0.5s */
.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s;
}

/* 进入前和离开后为透明，并在右侧20px位置 */
.fade-right-enter,
.fade-right-leave {
  opacity: 0;
  transform: translateX(20px);
}
</style>
<template>
  <el-container>
    <adminleftNav></adminleftNav>
    <el-container>
      <el-header>
        <navtop></navtop>
      </el-header>
      <el-main>
        <transition name="fade-right" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import navtop from "@/components/LoginAndLayout/nav-top.vue";
import adminleftNav from "@/components/LoginAndLayout/nav-left-admin.vue";
export default {
  components: {
    navtop,
    adminleftNav,
  },
  data() {
    return {
      adminVisible: false,
      userList: [],
    };
  },
  created() {
    this.userList = JSON.parse(sessionStorage.getItem('token'))
    var power = this.userList[0].power
    this.changeLeft(power)
  },
  methods: {
    changeLeft(power) {
      if (power == 1) {
        this.adminVisible = true
      }
      else {
        this.userVisible = true
      }
    }
  }
};
</script>