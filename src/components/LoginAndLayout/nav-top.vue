<style scoped>
.header_container{
		background-color: #d6d6d6;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 10px;
	}
.el-dropdown-menu__item {
    list-style: none;
    line-height: 36px;
    padding: 0 10px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
  }
</style>

<template>
  <div class="header_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
			<el-breadcrumb-item :to="{ path: '/VisualReports' }">个人中心</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
      <el-dropdown>
        <label><i class="el-icon-user"></i>{{this.userList[0].username}}</label>
        <el-dropdown-menu>
          <el-dropdown-item @click.native="quitlogin">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      
    </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      activeIndex: "1",
    };
  },
  created() {
    this.userList = JSON.parse(sessionStorage.getItem('token'))
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    quitlogin(){
      this.$router.push({path:'/'});
    }
  }
};
</script>
