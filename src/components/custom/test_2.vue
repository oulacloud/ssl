<template>

  <div>
    <div class="upload">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      accept=".xlsx"
      :show-file-list="false"
      :on-exceed="exceed"
      :limit="1"
      :on-remove="remove"
      :http-request="uploadFile"
    >
      <el-button slot="trigger" size="small" type="primary" 
        >选取文件生成图表</el-button
      >
    </el-upload>
  </div>
    
    <div class="generate" v-if="chartName">
       <new-charts :chartName="chartName" :resultData="listTable"></new-charts>
    </div>
    
  
  </div>
  

  

</template>

<script>
import XLSX from "xlsx";
import NewCharts from "./components/NewCharts.vue";
export default {
  components: {
    NewCharts
  },
  data() {
    return {
        listTable: [],
        chartName: ''
    };
  },
  methods: {
    uploadFile(params) {
      this.chartName = params.file.name.replace('.xlsx','')
      console.log(params);
      const _file = params.file;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          
          const data = ev.target.result;
          const workbook = XLSX.read(data,{
            type: 'binary'
          });
          // console.log(workbook)
          for(let sheet in workbook.Sheets) {
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{ raw: true });
            if(sheetArray.length == 0) {
              continue;
            }
            console.log("读取文件",sheetArray)
            
            for(let item in sheetArray) {
              let rowTable = {}
              rowTable.first = sheetArray[item].时间;
              rowTable.second = sheetArray[item].成交套数
              rowTable.third = sheetArray[item].成交均价
              this.listTable.push(rowTable)     
            }
            console.log(this.listTable)
          }
        } catch(e) {
          console.log(e)
        }
      };
      fileReader.readAsBinaryString(_file)
    },
    exceed() {
      console.log("只能上传一个文件")
    },
    remove() {},
  },
};
</script>

<style  scoped>
.upload-demo {
  width: 60px;
  height: 60px;
}

.generate {
  height: 320px;
  width: 400px;
}
</style>