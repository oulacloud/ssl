<template>
  <div class="loginbody">
    <div class="logindata">
      <div class="logintext">
        <h2>Welcome</h2>
      </div>
      <!-- 登录表单 -->
      <div class="formdata">
        <!-- 关于ref： 绑定控件，获取dom，是对js获取节点的优化
        这里主要是为了在提交表单时，再一次对输入内容做验证-->
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item prop="login_username">
            <!-- auto-complete="off" 阻止浏览器自动填充
            v-model="Form.userName" 挂载表单
            prefix-icon="el-icon-user-solid" Elementui内置icon,在不同的标签中使用不同的class标签以适应-->
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="loginForm.login_username"
              clearable
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="login_password">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="loginForm.login_password"
              clearable
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 忘记密码模块 -->
      <div class="tool">
        <div>
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <div>
          <span class="shou" @click="showFindDialog()">忘记密码？</span>
        </div>
      </div>
      <!-- 登录注册模块 -->
      <div class="butt">
        <el-button type="primary" @click.native.prevent="login('loginForm')">登录</el-button>
        <el-button @click="showResDialog()">注册</el-button>
      </div>
    </div>
    <!-- 找回密码表单 -->
    <el-dialog title="找回密码" :close-on-click-modal='false' center :visible.sync="findShow" :append-to-body='true'>
      <el-form ref="findForm" :model="findForm" :rules="rules">
        <el-form-item prop="find_userName">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="findForm.find_userName"
            clearable
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="find_phone">
          <el-input
            prefix-icon="el-icon-phone"
            v-model="findForm.find_phone"
            clearable
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="find_newpassword">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="findForm.find_newpassword"
            clearable
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="find_renewpassword">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="findForm.find_renewpassword"
            clearable
            placeholder="请再次输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <div class="findbutt">
          <el-button type="primary" @click.native.prevent="find('findForm')">提交</el-button>
          <el-button @click="showFindDialog()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 注册表单 -->
    <el-dialog title="注册" :close-on-click-modal='false' center :visible.sync="resShow" :append-to-body='true'>
      <el-form ref="resForm" :model="resForm" :rules="rules">
        <el-form-item prop="res_username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="resForm.res_username"
            clearable
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="res_password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="resForm.res_password"
            clearable
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="res_again_password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="resForm.res_again_password"
            clearable
            placeholder="请确认密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="res_phone">
          <el-input
            prefix-icon="el-icon-phone"
            v-model="resForm.res_phone"
            clearable
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="res_email">
          <el-input
            prefix-icon="el-icon-message"
            v-model="resForm.res_email"
            clearable
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <div class="findbutt">
          <el-button type="primary" @click.native.prevent="res('resForm')">提交</el-button>
          <el-button @click="showResDialog()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "login",
  data() {
    // 验证密码-通用
    var all_password_test = (rule, value, callback) => {
      const rightpass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/
      if (rightpass.test(value)) {
        callback();
      } else {
          callback(new Error('密码由英文字母、数字或者符号组成，且至少包含两种'));
      }
    };
    // 验证找回密码中两次输入的是否相同
    var find_renewpassword_des = (rule, value, callback) => {
      if (value !== this.findForm.find_newpassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
          callback();
      }
    };
    // 验证注册中两次输入的是否相同
    var res_renewpassword_des = (rule, value, callback) => {
      if (value !== this.resForm.res_password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
          callback();
      }
    };
    // 验证用户名-通用
    var res_username = (rule, value, callback) => {
      const rightname = /^[a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (rightname.test(value)) {
        callback();
      } else {
          callback(new Error('用户名由字符或数字组成'));
      }
    };
    // 验证手机号-通用
    var res_phone = (rule, value, callback) => {
      const rightphone = /^(1[34578]\d{9})$/
      if (rightphone.test(value)) {
        callback();
      } else {
          callback(new Error('请输入正确的手机号'));
      }
    };
    // 验证邮箱-通用
    var res_email = (rule, value, callback) => {
      const rightemail = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
      if (rightemail.test(value)) {
        callback();
      } else {
          callback(new Error('请输入正确的邮箱'));
      }
    };
    return {
      findShow: false,
      resShow: false,
      // 登录提交表单
      loginForm: {
        login_username: '',
        login_password: ''
      },
      // 忘记密码提交表单
      findForm: {
        find_userName: '',
        find_phone: '',
        find_newpassword: '',
        find_renewpassword: ''
      },
      // 注册表单
      resForm: {
        res_username: '',
        res_phone: '',
        res_password: '',
        res_email: '',
        res_again_password: '',
        res_power: '0'
      },
      checked: false,
      rules: {
        login_username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        login_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        find_userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        find_phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
        ],
        find_newpassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度为6-16个字符", trigger: "blur" },
          { validator: all_password_test, trigger: 'blur' }
        ],
        find_renewpassword: [
          { required: true, message: "请重新输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度为6-20个字符", trigger: "blur" },
          { validator: find_renewpassword_des, trigger: 'blur' }
        ],
        res_username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 8, message: "用户名为2-8个字符", trigger: "blur" },
          { validator: res_username, trigger: 'blur' }
        ],
        res_password: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度为6-20个字符", trigger: "blur" },
          { validator: all_password_test, trigger: 'blur' }
        ],
        res_again_password: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度为6-16个字符", trigger: "blur" },
          { validator: res_renewpassword_des, trigger: 'blur' }
        ],
        res_phone: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度为6-16个字符", trigger: "blur" },
          { validator: res_phone, trigger: 'blur' }
        ],
        res_email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: res_email, trigger: 'blur' }
        ],
      },
    };
  },
  // created阶段:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  // mounted阶段:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted() {
    // 判断cookie空值情况
    if (this.getCookie("username") != '' & this.getCookie("password") != ''){
      this.checked = true
      // 输出查看下cookie
      // username=xxx";password=xxx
      // console.log(document.cookie)
      this.loginForm.login_username = this.getCookie("username");
      this.loginForm.login_password = this.getCookie("password");
    }
    document.addEventListener('keydown', this.handleWatchEnter);
  },
  methods: {
    // 监听键盘事件
    handleWatchEnter(e) {
      var key = window.event ? e.keyCode : e.which;
      if (key == 13) {
        this.login('loginForm')
      }
    },
    // 设置cookie
    // cookie与session和local区别
    setCookie(c_name, c_pwd, exdate) {
      var exdate = new Date();
      exdate.setTime(exdate.getDate() + exdate); //保存的天数
      document.cookie = "username=" + c_name + ";path=/;expires=" + exdate.toLocaleString();
      document.cookie = "password=" + c_pwd + ";path=/;expires=" + exdate.toLocaleString();
    },
    // 转换数组，返回值
    getCookie(name) {
      var arr = document.cookie.split(";");
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("=");
        if (arr2[0].trim() == name) {
          return arr2[1];
        }
      }
    },
    // 清除cookie
    clearCookie() {
      this.setCookie("", "", -1); //清除cookie this.setCookie(username, "", -1)
    },
    // 登录请求
    login(from) {
      this.$refs[from].validate((valid) => {
        if (valid) {
          if (this.checked == true) {
            this.setCookie(
              this.loginForm.login_username,
              this.loginForm.login_password,
              7
            ); //保存7天
          } else {
            this.clearCookie();
          }
          this.logining = true;
          // alert(this.form.userName);
          // 通过 params 对象传递参数
          axios.get('/api/loginPage', {
            params: {
              loginType: "login",
              login_username: this.loginForm.login_username,
              login_password: this.loginForm.login_password
            }
          })
          .then(res => {
            if(res.data.state != 0) {
              this.logining = false;
              var nameofuser = res.data.state;
              // 跳转页面，传输数据，query传入页面刷新后数据不丢失
              // this.$router.push({path: '/nav-left', query:{userId: nameofuser}});
              // 存储到浏览器
              sessionStorage.setItem("token",JSON.stringify(nameofuser))
              this.$router.push({path:'/VisualReports'});
            }
            else {
              this.logining = false;
              this.$alert('用户名或密码错误!', '提示', {
                confirmButtonText: '确定'
                })
              return false;
              }
            })
          }
        });
    },
    // 找回请求
    find(from) {
      this.$refs[from].validate((valid) => {
        if (valid) {
          // 通过 params 对象传递参数
          // 查询输入信息
          axios.get('/api/loginPage', {
            params: {
              loginType: "findPass",
              find_userName: this.findForm.find_userName,
              find_phone: this.findForm.find_phone,
            }
          })
          .then(res => {
            if(res.data.state == 1) {
              axios.get('/api/loginPage', {
                params: {
                  loginType: "savePass",
                  find_userName: this.findForm.find_userName,
                  find_newpassword: this.findForm.find_newpassword
                }
              })
              // 点击确定后刷新页面
              // $.ajax的回调function中的this与element-ui的this.$alert冲突
              if(res.data.state == 1){
                this.$alert('密码修改成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                  }
                })
                this.showFindDialog()
              }else{
                this.$alert('密码修改失败！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      type: 'info',
                      message: '修改失败!'
                    });
                  }
                })
              }
            }
            else {
              this.$alert('用户名或手机号错误!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$message({
                      type: 'info',
                      message: '修改失败!'
                    });
                  }
                })
              return false;
              }
            })
          } 
        })
    },
    // 注册请求
    res(from) {
      this.$refs[from].validate((valid) => {
        if (valid) {
          axios.get('/api/loginPage', {
            params: {
              loginType: "resUser",
              res_username: this.resForm.res_username,
              res_password: this.resForm.res_password,
              res_phone: this.resForm.res_phone,
              res_email: this.resForm.res_email,
              res_power: this.resForm.res_power,
            }
          })
          .then(res => {
            console.log(res.data)
            if(res.data.state == 1) {
              this.$alert('注册成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'success',
                    message: '注册成功!'
                  });
                }
              });
              this.showResDialog()
            }
            else if(res.data.state == 0) {
              this.$alert('用户名已存在!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: '注册失败!'
                  });
                }
              })
            }
            else {
              this.$alert('手机号已存在!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: '注册失败!'
                  });
                }
              })
            }
          })
        }
      });
    },
    // 显示和关闭找回密码框，并清除验证信息
    showFindDialog(){
      this.findShow =! this.findShow
      setTimeout(() => {
	      this.$refs['findForm'].resetFields()
      }, 0)
    },
    // 显示和关闭注册框，并清除验证信息
    showResDialog(){
      this.resShow =! this.resShow
      setTimeout(() => {
	      this.$refs['resForm'].resetFields()
      }, 0)
    },
    forgetpas() {
      this.$message({
        type:"info",
        message:"功能尚未开发额😥",
        showClose:true
      })
    },
    register() {},
  },
};
</script>

<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  background-image: url("../../../static/image/loginbg.jpg");
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 150px;
}

.logintext {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}

.logindata {
  width: 400px;
  height: 300px;
  transform: translate(-50%);
  margin-left: 50%;
}

.tool {
  display: flex;
  justify-content: space-between;
  color: #606266;
}

.butt {
  margin-top: 10px;
  text-align: center;
}

.shou {
  cursor: pointer;
  color: blue;
}

/* 深度修改dialog样式 */
.el-dialog__wrapper /deep/ .el-dialog {
    position: absolute;
    margin: auto;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    width: 380px;
    left: 0;
    right: 0;
    top :0;
}

.findbutt {
  /* margin-top: 30px; */
  text-align: center;
}
</style>