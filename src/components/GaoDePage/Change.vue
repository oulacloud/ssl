<template>
    <div>
        <el-button type="primary" @click="change_1()">1</el-button>
        <el-button type="primary" @click="change_5()">2</el-button>
        <download-excel class="export-excel-wrapper" :data="json_data" :fields="json_fields" name="导出的表格名称.xlsx">
            <el-button type="primary" size="small">3</el-button>
        </download-excel>
    </div>
</template>
<script>
import axios from 'axios'
import { saveAs } from 'file-saver'
export default {
    data() {
        return {
            list: ['杭州市', '温州市', '湖州市', '台州市', '嘉兴市', '绍兴市', '舟山市', '宁波市', '衢州市', '丽水市', '金华市'],
            features: [],
            json_fields: {
                城市: "city",
                区县: "dis",
                经度: "lon",
                纬度: "lat",
            },
            json_data: [
            ]
        }
    },
    methods: {
        change_1() {
            var len = this.list.length
            for (var i = 0; i < len; i++) {
                var name = this.list[i]
                this.change_2(name)
            }
        },
        change_2(name) {
            axios.get('/static/District/' + name + '.json')
                .then(res => {
                    var data = res.data
                    for (var j = 0; j < data.features.length; j++) {
                        data.features[j].properties.parent_name = name
                    }
                    var blob = new Blob([JSON.stringify(data)], {
                        type: "text/plain;charset=utf-8"
                    })
                    saveAs(blob, name + '.json')
                })
        },
        change_3() {
            var len = this.list.length
            for (var i = 0; i < len; i++) {
                var name = this.list[i]
                this.change_4(name)
            }
        },
        change_4(name) {
            axios.get('/static/District/' + name + '.json')
                .then(res => {
                    var data = res.data
                    for (var j = 0; j < data.features.length; j++) {
                        data.features[j].properties.parent_name = name
                        this.features.push(data.features[j])
                    }
                })
        },
        change_5() {
            var geojson = { "type": "FeatureCollection" };
            geojson.features = this.features
            var blob = new Blob([JSON.stringify(geojson)], {
                type: "text/plain;charset=utf-8"
            })
            saveAs(blob, "HZ_Dis_Pol_GD.json")
        },
        data_set() {
            axios.get('/static/gaode_json/HZ_Dis_Pol_GD.json')
                .then(res => {
                    var data = res.data
                    for (var i = 0; i < data.features.length; i++) {
                        var fea = {}
                        if (data.features[i].properties.centroid) {
                            fea.lon = data.features[i].properties.centroid[0]
                            fea.lat = data.features[i].properties.centroid[1]
                        }
                        else {
                            fea.lon = data.features[i].properties.center[0]
                            fea.lat = data.features[i].properties.center[1]
                        }
                        fea.city = data.features[i].properties.parent_name
                        fea.dis = data.features[i].properties.name
                        this.json_data.push(fea)
                    }
                })
                console.log(this.json_data)
        },
    },
    mounted() {
        // this.change_3()
        this.data_set()
    },
}
</script>