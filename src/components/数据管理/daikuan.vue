<template>
  <el-card>
    <el-row>
      <!-- 分栏一共占24格 -->
      <el-col :span="10">
        <!-- 搜索与添加区域 -->
        <el-input placeholder="请输入内容" v-model="year" clearable @blur="getshoplist()" @clear="getshoplist()">
          <el-button slot="append" icon="el-icon-search" @click="getshoplist()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" ref="refTable" style="font-size: 15px;" :header-cell-style="{ 'text-align': 'center' }"
      :data="schArr" :cell-style="{ 'text-align': 'center' }">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="日期:">
              <span>{{ props.row.日期 }}</span>
            </el-form-item>
            <el-form-item label="国内货款绝对量（亿元）:">
              <span>{{ props.row.国内货款绝对量 }}</span>
            </el-form-item>
            <el-form-item label="国内货款同比增长:">
              <span>{{ props.row.国内货款同比增长 }}</span>
            </el-form-item>
            <el-form-item label="年份:">
              <span>{{ props.row.年 }}</span>
            </el-form-item>
            <el-form-item label="月份:">
              <span>{{ props.row.月 }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="日期"></el-table-column>
      <el-table-column label="国内货款绝对量（亿元）" prop="国内货款绝对量"></el-table-column>
      <el-table-column label="国内货款同比增长" prop="国内货款同比增长"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" @click="clickTable(scope.row, $event)">查看详情</el-button>
          <el-button size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeshopByname(scope.row.shopname)">删除</el-button>
          <el-dialog title="修改商家" :visible.sync="editDialogVisible" width="600px" @close="editDialogClosed()"
            :close-on-click-modal='false'>
            <el-form :model="editShopForm" :rules="rules2" style="padding-top: 20px" ref="editShopForm"
              label-width="100px">
              <el-form-item label="商家名称" prop="shopname">
                <el-input v-model="editShopForm.shopname" disabled></el-input>
              </el-form-item>
              <el-form-item label="店长姓名" prop="shopuser">
                <el-input v-model="editShopForm.shopuser"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="shopphone">
                <el-input v-model="editShopForm.shopphone"></el-input>
              </el-form-item>
              <el-form-item label="商家地址" prop="shopaddress">
                <el-input v-model="editShopForm.shopaddress"></el-input>
              </el-form-item>
              <el-form-item label="商家介绍" prop="shopinter">
                <el-input v-model="editShopForm.shopinter"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" style="margin-right: 200px;" class="dialog-footer">
              <el-button @click="editDialogClosed()">取 消</el-button>
              <el-button type="primary" @click="editshop('editShopForm')">确 定</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
 
<style scoped>
/* 展开后信息位置 */
.demo-table-expand {
  font-size: 0;
  margin-left: 150px;
}

/* 展开后文字颜色 */
.demo-table-expand label {
  width: 90px;
  color: #8893a0;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table /deep/ .el-table__expanded-cell {
  background-color: #ebeef5 !important;
}
</style>
 
<script>
import axios from 'axios'
export default {
  data() {
    var checkMobile = (rule, value, callback) => {
      //验证手机号的正则表达式
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        return callback(); //合法手机号
      }
      return callback(new Error("请输入合法的手机号"));
    }
    return {
      queryInfo: {
        pagenum: 1, //当前的页数
        pagesize: 10, //每页的数量
      },
      loading: true,
      schArr: [],
      total: 0,
      year: '',
      huokuanList: [],
      editDialogVisible: false,
      editShopForm: {
        shopname: '',
        shopuser: '',
        shopaddress: '',
        shopinter: '',
        shopphone: ''
      },
      rules2: {
        shopuser: [{ required: true, message: '请输入店长姓名', trigger: 'blur' },
        { min: 2, max: 6, message: '姓名长度在2~6个字符', trigger: 'blur' }],
        shopaddress: [{ required: true, message: '请输入地址', trigger: 'blur' },
        { min: 3, max: 64, message: '地址长度在3~64个字符', trigger: 'blur' }],
        shopinter: [{ required: true, message: '请输入商家介绍', trigger: 'blur' },
        { min: 3, max: 128, message: '介绍长度在3~128个字符', trigger: 'blur' }],
        shopphone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.loading = true
    this.getshoplist();
  },
  methods: {
    getshoplist() {
      axios.get('/api/daikuanlist')
        .then(res => {
          this.loading = true
          if (res.data.state == 0) {
            return this.$message.error("获取货款列表失败！");
          }
          else {
            this.huokuanList = res.data;
            let flag2 = 0;
            // 搜索框为空时
            if (this.year == '') {
              this.total = this.huokuanList.length;
              let start = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize;
              let end = start + this.queryInfo.pagesize;
              this.schArr = this.huokuanList.slice(start, end);
            } // 搜索框非空时
            else {// 首先将schArr赋值为空，否则会保留page-size储存的信息
              this.schArr = [];
              this.huokuanList.forEach((item) => {
                var date = item.日期;// 进行字符串比对，若包含就放入schArr
                if (date.includes(this.year) == true) {
                  this.schArr.push(this.huokuanList[flag2])
                }
                flag2 = flag2 + 1;
              })// 完成筛选后需要对schArr进行slice，并重新定义total
              this.total = this.schArr.length;
              let start = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize;
              let end = start + this.queryInfo.pagesize;
              this.schArr = this.schArr.slice(start, end);
            }
          }
          this.loading = false
        })
    },
    // 强制查看详情按钮样式
    clickTable(row, event) {
      event.target.blur();
      if (event.target.nodeName == "SPAN") {
        event.target.parentNode.blur();
      }
      this.$refs.refTable.toggleRowExpansion(row)
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;//重新指定每页数据量
      this.getshoplist();//带着新的分页请求获取数据
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;//重新指定当前页
      this.getshoplist();//带着新的分页请求获取数据
    },
    editDialogClosed() {
      this.$refs["editShopForm"].clearValidate();
      this.editDialogVisible = false;
    },
    showEditDialog(row) {
      this.editShopForm.shopname = row.shopname;
      this.editShopForm.shopuser = row.shopuser;
      this.editShopForm.shopphone = row.shopphone;
      this.editShopForm.shopaddress = row.shopaddress;
      this.editShopForm.shopinter = row.shopinter;
      this.editDialogVisible = true;
    },
    editshop(editShopForm) {
      this.$refs[editShopForm].validate((valid) => {
        if (valid) {
          axios.get('/api/editshop', {
            params: {
              shopname: this.editShopForm.shopname,
              shopuser: this.editShopForm.shopuser,
              shopphone: this.editShopForm.shopphone,
              shopaddress: this.editShopForm.shopaddress,
              shopinter: this.editShopForm.shopinter,
            }
          })
            .then(res => {
              if (res.data.state == 1) {
                this.$alert('信息修改成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.editDialogVisible = false;
                    this.getshoplist();
                  }
                })
              }
            })
        }
      })
    },
    removeshopByname(shopname) {
      this.$confirm('此操作将永久删除商家, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          axios.get('/api/deleteshop', {
            params: {
              shopname: shopname
            }
          })
            .then(res => {
              if (res.data.state == 1) {
                this.$message({ type: 'success', message: '删除成功!' });
                this.getshoplist();
              }
              else {
                this.$alert('该商家尚有食品出售，无法删除！', '提示', {
                  confirmButtonText: '确定',
                })
              }
            })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
    }
  }
}
</script>