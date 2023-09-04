<template>
    <div slot="title" class="showTable"> 
        <el-button class="title_btn" @click="showTable">显示数据</el-button>

        <el-dialog :title="title" :visible.sync="dialogTableVisible" :modal="false">
          <el-table :data="resData.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe>
            <el-table-column
              property="NAME"
              label="年份"
              width="150"
            ></el-table-column>
            <el-table-column
              property="NUM_RENCI"
              label="人次"
              width="200"
            ></el-table-column>
            <el-table-column property="NUM_RENSHU" label="人数">
            </el-table-column>
          </el-table>

            <el-pagination
             v-if="resData.length > 0"
             :current-page="currentPage"
             :page-sizes="[5,10,15,20]"
             :page-size="pageSize"
             :total="resData.length"
             @current-change="handlePageChange"
             @size-change="handlePageSizeChange">
            </el-pagination>

        </el-dialog>

        
    </div>
</template>

<script>
    export default {
        props:{
            title: {
                type: String,
                require: true
            },
            // table数据
            resData: {
                type: Array,
                require: true
            }
        },
        data(){
            return {
                dialogTableVisible: false,
                total: 0,
                pageSize: 6,
                currentPage: 1,

            }
        },
        methods: {
            showTable() {
                this.dialogTableVisible = !this.dialogTableVisible;
                console.log("shuju",this.$props.resData.length)
            },
            handlePageChange(currentPage) {
                this.currentPage = currentPage;

            },
            handlePageSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.currentPage = 1;

            }
        }
    }
</script>

<style  scoped>
.title_btn {
  float: left;
}

.showTable {
    width: 20px;
    height: 40px;
    display:inline-block;
    position: absolute;
    margin-left: 10px;
    /* z-index: 300000; */
}

</style>