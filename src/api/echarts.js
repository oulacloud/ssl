import instance from '../utils/request'

// ppt第六张--累计净增购房人有无房比例
export function GetPptSix(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_MID_YEAR_PEOPLE_TYPE_ADD_NUM',
    })
}
// 19 净增省人数
export function PROVINCE_NUM_ALLYEAR(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_HZ_YAOHAO_PEOPLE_NUM_PROVINCE_ALLYEAR',
    })
}
// 杭州总部
export function HZ_COMPANY_LOCATION(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_HZ_COMPANY_LOCATION',
    })
}

// ppt第5张
export function getPptFive(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_MID_YEAR_ADD_NUM_ONEYEAR_AND_ALLYEAAR',
    })
}
// ppt 48 各板块平均中签率
export function HZ_PLATE_RATE(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_HZ_YAOHAO_CAL_BY_MAP_PLATE',
    })
}
// ppt 20 净增市人数
export function CITY_NUM_ALLYEAR(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_PEOPLE_NUM_CITY_ALLYEAR',
    })
}
// 专精特新
export function SPECIALIZED_AND_NEW(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_SPECIALIZED_AND_NEW_COMPANY',
    })
}
// 市内摇号数据
export function INPROVINCE_CITY_NUM(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_INPROVINCE_CITY_NUM_ALLYEAR',
    })
}

// 人口普查_分省总人数和平均受教育年限
export function CPC_POU_AVGSCHY(){
    return instance({
        method: 'GET',
        url: '/api/Test/Get_People',
    })
}

// 省内区县市摇号人数
export function HZ_DIS_NUM(){
    return instance({
        method: 'GET',
        url: '/api/HzYaoHaoData/Get_PEOPLE_REGION_NUM_ALLYEAR',
    })
}