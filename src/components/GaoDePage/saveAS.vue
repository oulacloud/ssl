<template></template>
<script>
import { saveAs } from 'file-saver'
export default {
    data() {
        return {}
    },
    methods: {
        saveAs() {
            for (var i = 0; i < this.list.length; i++) {
                var url = 'https://geo.datav.aliyun.com/areas_v3/bound/' + this.list[i] + '_full.json'
                axios.get(url)
                    .then(res => {
                        for (var j = 0; j < res.data.features.length; j++) {
                            this.fea_lis.push(res.data.features[j])
                        }
                    })
            }
            setTimeout(() => {
                var geojson = { "type": "FeatureCollection" };
                var features = []
                features.push(this.fea_lis)
                geojson.features = features
                var content = JSON.stringify({
                    jiedao: geojson,
                })
                var blob = new Blob([content], {
                    type: "text/plain;charset=utf-8"
                })
                saveAs(blob, "jiedao_8hou.json")
            }, 10000)

        },
        data_change() {
            var geojson = { "type": "FeatureCollection" }
            var features = []
            var feature = { "type": "Feature" }
            var geometry = { "type": "MultiLineString" }
            geometry.coordinates = this.dataasd
            feature.geometry = geometry
            features.push(feature)
            geojson.features = features
            var content = JSON.stringify({
                jiedao: geojson,
            })
            var blob = new Blob([content], {
                type: "text/plain;charset=utf-8"
            })
            saveAs(blob, "jiedao_8hou.json")
        }
    }

}
</script>





