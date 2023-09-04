<style scoped>
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
</style>
<template>
<div>
  <!-- 卡片视图 -->
<el-card>
    <el-row>
        <!-- 分栏一共占24格 -->
        <el-col :span="10">
            <!-- 搜索与添加区域 -->
            <el-input placeholder="请输入内容" v-model="uname" clearable @blur="getuserslist()" @clear="getuserslist()">
                <el-button slot="append" icon="el-icon-search" @click="getuserslist()"></el-button>
            </el-input>
        </el-col>
    </el-row>
    <el-table style="font-size: 15px" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="schArr" border stripe><!-- 带边框、斑马纹 -->
        <el-table-column label="序号" width="100px" type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="权限" prop="power"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 放置修改、删除 -->
            <el-tooltip effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserByname(scope.row.username)"></el-button>
            </el-tooltip>
            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="400px" @close="editDialogClosed()" :close-on-click-modal='false'>
              <!-- 内容主体区 -->
              <el-form :model="editUserForm" style="padding-top: 20px" :rules="editUserFormRules" ref="editUserForm" label-width="70px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                  <el-input v-model="editUserForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
              </el-form>
              <!-- 底部区 -->
              <span slot="footer" style="margin-right: 95px;" class="dialog-footer">
                <el-button @click="editDialogClosed()">取 消</el-button>
                <el-button type="primary" @click="editUser('editUserForm')">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
      var checkEmail = (rule,value,callback) =>{
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(regEmail.test(value)){
          return callback(); //合法邮箱
        }
        return callback(new Error("请输入合法的邮箱"));
      }
      var checkMobile = (rule,value,callback) =>{
        //验证手机号的正则表达式
        const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if(regMobile.test(value)){
          return callback(); //合法手机号
        }
        return callback(new Error("请输入合法的手机号"));
      }
        return {
          //获取用户列表的参数对象
          queryInfo: {
          pagenum: 1, //当前的页数
          pagesize: 10, //每页的数量
        },
          uname: '',// 绑定搜索框
          schArr: [],// 从usersList中slice部分进行显示
          usersList: [],
          total: 0,
          editDialogVisible: false, //控制修改用户对话框的显示与隐藏
          //修改用户的表单数据
          editUserForm: {
            username: '',
            phone: '',
            email: ''
          },
          //修改表单的验证规则对象
          editUserFormRules: {
            email: [{required:true,message:'请输入邮箱',trigger:'blur'},{validator: checkEmail,trigger:'blur'}],
            phone: [{required:true,message:'请输入手机号',trigger:'blur'},{validator: checkMobile,trigger:'blur'}]
          },
        }
    },
    created(){
      this.getuserslist();
    },
    methods: {
      getuserslist(){
        axios.get('/api/userlist')
        .then(res => {
          if(res.data.state == 0){
            return this.$message.error("获取用户列表失败！");
          }
          else{
            this.usersList = res.data;
            // this.total = this.usersList.length;
            let flag = 0;
            let flag2 = 0;
            this.usersList.forEach((item) => {
              if(item.power == 1){
                this.usersList[flag].power = '管理员';
                flag = flag + 1;
              }
              else{
                this.usersList[flag].power = '普通用户';
                flag = flag + 1;
              }
            });// 搜索框为空时
            if (this.uname == ''){
              this.total = this.usersList.length;
              let start = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize;
              let end = start + this.queryInfo.pagesize;
              this.schArr = this.usersList.slice(start, end);
            }// 搜索框非空时
            else{// 首先将schArr赋值为空，否则会保留page-size储存的信息
              this.schArr = [];
              this.usersList.forEach((item) => {
                var username = item.username;// 进行字符串比对，若包含就放入schArr
                if(username.includes(this.uname) == true){
                  this.schArr.push(this.usersList[flag2])
                }
                flag2 = flag2 + 1;
              })// 完成筛选后需要对schArr进行slice，并重新定义total
              this.total = this.schArr.length;
              let start = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize;
              let end = start + this.queryInfo.pagesize;
              this.schArr = this.schArr.slice(start, end);
            }
          }
        })
      },
      //根据ID删除对应用户信息
      removeUserByname(uid){
        var userid = JSON.parse(sessionStorage.getItem('token'))[0].username
        if(uid == userid){
          this.$alert('请登录其它管理员账号进行删除!', '提示', {
            confirmButtonText: '确定'
          })
        }
        else{
          //弹框询问用户是否删除数据
        this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          axios.get('/api/deleteuser', {
            params: {
              username: uid
            }
          }).then(res => {
            if (res.data.state != 0){
              this.$message({type: 'success',message: '删除成功!'});
              this.getuserslist();  
            }
            else{
              this.$alert('该用户尚有商家在线!', '提示', {
                confirmButtonText: '确定',
              })
            }
          })
          
          })
        .catch(() => {
          this.$message({type: 'info',message: '已取消删除' });          
        });
        }
        
      },
      //关闭编辑用户的对话框，重置表单
      editDialogClosed(){
        this.$refs["editUserForm"].clearValidate();
        this.editDialogVisible = false;
      },
      //展示编辑用户的对话框
      showEditDialog(row){
        var userid = JSON.parse(sessionStorage.getItem('token'))[0].username
        if (row.username == userid){
          this.$alert('请到个人中心进行修改！', '提示', {
            confirmButtonText: '确定',  
          })
        }
        else{
          this.editUserForm.username = row.username;
          this.editUserForm.phone = row.phone;
          this.editUserForm.email = row.email;
          this.editDialogVisible = true;
        } 
      },
      //点击按钮，修改用户信息
      editUser(editUserForm){
        this.$refs[editUserForm].validate((valid) =>{
          if(valid){
            axios.get('/api/editusermess', {
              params: {
                username: this.editUserForm.username,
                phone: this.editUserForm.phone,
                email: this.editUserForm.email
              }
            })
            .then(res => {
              if (res.data.state == 0){
                this.$alert('手机号已存在！', '提示', {
                  confirmButtonText: '确定'
                })
              }
              else{
                this.$message.success('修改用户成功！');
                // 隐藏修改用户的对话框
                this.editDialogVisible = false;
                //重新获取用户列表数据
                this.getuserslist();
              }
            })
          }
        })
      },
      //监听 pagesize 改变的事件
      handleSizeChange(newSize){
        // console.log(newSize);
        this.queryInfo.pagesize = newSize;//重新指定每页数据量
        this.getuserslist();//带着新的分页请求获取数据
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage){
        // console.log(newPage);
        this.queryInfo.pagenum = newPage;//重新指定当前页
        this.getuserslist();//带着新的分页请求获取数据
      }
    }
}
</script>
