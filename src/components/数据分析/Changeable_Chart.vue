<template>
    <div class="Lbody">
        <div class="box_fex">

            <el-tooltip content="修改样式" placement="top">
                <el-button @click="drawer = true" type="default" icon="el-icon-edit" circle id="edit-btn"></el-button>
            </el-tooltip>
            <el-popover placement="top-start" title="" width="200" trigger="hover" class="refer_btn" content="注：图表详情信息">
                <el-button slot="reference" icon="el-icon-question" circle></el-button>
            </el-popover>
            <el-button @click="copy" icon="el-icon-share" circle>
            </el-button>

            <el-upload action="https://jsonplaceholder.typicode.com/posts/" accept=".xlsx" :show-file-list="false"
                :on-exceed="exceed" :limit="10" :on-remove="remove" :http-request="uploadFile">
                <el-button slot="trigger" size="small" type="primary">选取文件生成图表</el-button>
            </el-upload>

        </div>
        <div class="eldrawer">
            <el-drawer :visible.sync="drawer" direction="ltr" custon-class="drawer" :modal=false title="修改配置项">
                <el-tabs type="border-card">
                    <!-- 图表选项 -->
                    <el-tab-pane>
                        <span slot="label"><i class="el-icon-setting"></i>图表选项</span>

                        <!-- 标题文本控制 -->
                        <el-collapse accordion>
                            <el-collapse-item title="标题文本" name="1.1">

                                <!-- 标题内容 -->
                                <div class="block">
                                    <el-input v-model="title_text" placeholder="请输入图表标题">
                                        <span slot="prepend">标题</span>
                                    </el-input>
                                </div>

                                <!-- 标题大小 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="字体大小">
                                        <el-slider v-model="title_size" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 距离顶部距离 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="顶部距离">
                                        <el-slider v-model="title_top" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 距离左边距离 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="左边距离">
                                        <el-slider v-model="title_left" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 标题颜色 -->
                                <div class="block">
                                    <el-input v-model="title_color" placeholder="请选择标题颜色" class="input">
                                        <span slot="prepend">标题颜色</span>
                                    </el-input>
                                    <el-color-picker show-alpha v-model="title_color" class="colorPicker">
                                    </el-color-picker>
                                </div>

                                <!-- 背景颜色 -->
                                <div class="block">
                                    <el-input v-model="title_bg_color" placeholder="请选择背景颜色" class="input">
                                        <span slot="prepend">背景颜色</span>
                                    </el-input>
                                    <el-color-picker show-alpha v-model="title_bg_color" class="colorPicker">
                                    </el-color-picker>
                                </div>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- 图例选项 -->
                        <el-collapse accordion>
                            <el-collapse-item title="图例选项" name="1.2">

                                <!-- 图例显示 -->
                                <el-switch v-model="leg_show" inactive-text="是否显示">隐藏
                                </el-switch>

                                <!-- 图例水平垂直切换 -->
                                <el-switch v-model="leg_h_v" inactive-text="水平/垂直">
                                </el-switch>

                                <!-- 距离顶部距离 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="顶部距离">
                                        <el-slider v-model="leg_top" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 距离左边距离 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="左边距离">
                                        <el-slider v-model="leg_left" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- X轴选项 -->
                        <el-collapse accordion>
                            <el-collapse-item title="X轴选项" name="1.2">

                                <!-- 刻度标签 -->
                                <div class="block">
                                    <el-switch v-model="x_label_show" inactive-text="标签显示" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 字体加粗 -->
                                <div class="block">
                                    <el-switch v-model="x_font_bold" inactive-text="是否粗体" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 标签颜色 -->
                                <div class="block">
                                    <el-input v-model="x_font_color" placeholder="请选择字体颜色" class="input">
                                        <span slot="prepend">标签颜色</span>
                                    </el-input>
                                    <el-color-picker show-alpha v-model="x_font_color" class="colorPicker">
                                    </el-color-picker>
                                </div>

                                <!-- 轴线显示 -->
                                <div class="block">
                                    <el-switch v-model="x_line_show" inactive-text="轴线显示" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 字体大小 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="字体大小">
                                        <el-slider v-model="x_font_size" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 倾斜角度 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="倾斜角度">
                                        <el-slider v-model="x_rotate" :max=90 show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- 左y轴选项 -->
                        <el-collapse accordion>
                            <el-collapse-item title="左侧Y轴" name="1.2">

                                <!-- 刻度标签 -->
                                <div class="block">
                                    <el-switch v-model="yl_label_show" inactive-text="标签显示" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 字体加粗 -->
                                <div class="block">
                                    <el-switch v-model="yl_font_bold" inactive-text="是否粗体" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 标签颜色 -->
                                <div class="block">
                                    <el-input v-model="yl_font_color" placeholder="请选择字体颜色" class="input">
                                        <span slot="prepend">标签颜色</span>
                                    </el-input>
                                    <el-color-picker show-alpha v-model="yl_font_color" class="colorPicker">
                                    </el-color-picker>
                                </div>

                                <!-- 轴线显示 -->
                                <div class="block">
                                    <el-switch v-model="yl_line_show" inactive-text="轴线显示" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 字体大小 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="字体大小">
                                        <el-slider v-model="yl_font_size" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- y轴单位 -->
                                <div class="block">
                                    <el-input v-model="yl_unit" placeholder="请输入单位" class="input">
                                        <span slot="prepend">Y轴单位</span>
                                    </el-input>
                                </div>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- 右y轴选项 -->
                        <el-collapse accordion>
                            <el-collapse-item title="左侧Y轴" name="1.2">

                                <!-- 刻度标签 -->
                                <div class="block">
                                    <el-switch v-model="yr_label_show" inactive-text="标签显示" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 字体加粗 -->
                                <div class="block">
                                    <el-switch v-model="yr_font_bold" inactive-text="是否粗体" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 标签颜色 -->
                                <div class="block">
                                    <el-input v-model="yr_font_color" placeholder="请选择字体颜色" class="input">
                                        <span slot="prepend">标签颜色</span>
                                    </el-input>
                                    <el-color-picker show-alpha v-model="yr_font_color" class="colorPicker">
                                    </el-color-picker>
                                </div>

                                <!-- 轴线显示 -->
                                <div class="block">
                                    <el-switch v-model="yr_line_show" inactive-text="轴线显示" class="switch">
                                    </el-switch>
                                </div>

                                <!-- 字体大小 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="字体大小">
                                        <el-slider v-model="yr_font_size" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- y轴单位 -->
                                <div class="block">
                                    <el-input v-model="yr_unit" placeholder="请输入单位" class="input">
                                        <span slot="prepend">Y轴单位</span>
                                    </el-input>
                                </div>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- 布局 -->
                        <el-collapse accordion>
                            <el-collapse-item title="布局" name="1.2">

                                <!-- 左右缩放距离 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="左右缩放">
                                        <el-slider v-model="width_dis" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 上下缩放距离 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="上下缩放">
                                        <el-slider v-model="height_dis" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                            </el-collapse-item>
                        </el-collapse>

                    </el-tab-pane>
                    <!-- 数据选项 -->
                    <el-tab-pane>
                        <span slot="label"><i class="el-icon-setting"></i>图表选项</span>

                        <!-- 柱线划分 -->
                        <el-collapse accordion>
                            <el-collapse-item title="柱线划分" name="1.1">

                                <!-- 柱类型个数 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="柱个数">
                                        <el-slider v-model="cut" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- 柱状图控制 -->
                        <el-collapse accordion>
                            <el-collapse-item title="柱状图配置" name="1.1">

                                <!-- 柱圆角半径 -->
                                <el-form label-width="80px" label-position="left">
                                    <el-form-item label="圆角半径">
                                        <el-slider v-model="radius" show-input :show-input-controls="false">
                                        </el-slider>
                                    </el-form-item>
                                </el-form>

                                <!-- 标签配置 -->
                                <el-collapse accordion>
                                    <el-collapse-item title="标签配置" name="1.3">
                                        <!-- 标签是否显示 -->
                                        <el-switch v-model="bar_item_show" inactive-text="标签显示">隐藏
                                        </el-switch>

                                        <!-- bar-标签位置 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="标签位置">
                                                <el-select v-model="bar_item_pos" placeholder="请选择">
                                                    <el-option v-for="item in bar_item_pos_options" :key="item.bar_item_pos"
                                                        :label="item.label" :value="item.bar_item_pos">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>

                                        <!-- bar-数据类型 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="数据类型">
                                                <el-select v-model="bar_item_type" placeholder="请选择">
                                                    <el-option v-for="item in bar_item_type_options"
                                                        :key="item.bar_item_type" :label="item.label"
                                                        :value="item.bar_item_type">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>

                                        <!-- bar-数据位数 -->
                                        <div class="block">
                                            <div class="block_left">
                                                <el-input v-model="bar_item_fixed" placeholder="请输入" class="input">
                                                    <span slot="prepend">保留位数</span>
                                                </el-input>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                </el-collapse>

                                <!-- 颜色配置 -->
                                <el-collapse accordion>
                                    <el-collapse-item title="颜色配置" name="1.2">

                                        <!-- 柱1颜色配置 -->
                                        <div class="block" v-show="l >= 1 && cut >= 1 ? true : false">
                                            <span class="demonstration"
                                                v-show="l >= 1 && cut >= 1 ? true : false">柱1颜色配置</span>
                                            <el-input v-model='bar1_tColor' placeholder="请选择颜色" class="input"
                                                :disabled="true">
                                                <span slot="prepend">顶部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model='bar1_tColor' class="colorPicker">
                                            </el-color-picker>
                                        </div>
                                        <div class="block" v-show="l >= 1 && cut >= 1 ? true : false">
                                            <el-input v-model="bar1_bColor" placeholder="请选择颜色" class="input"
                                                :disabled="true">
                                                <span slot="prepend">底部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model="bar1_bColor" class="colorPicker">
                                            </el-color-picker>
                                        </div>

                                        <!-- 柱2颜色配置 -->
                                        <div class="block" v-show="l >= 2 && cut >= 2 ? true : false">
                                            <span class="demonstration"
                                                v-show="l >= 2 && cut >= 2 ? true : false">柱2颜色配置</span>
                                            <el-input v-model='bar2_tColor' placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 2 ? false : true">
                                                <span slot="prepend">顶部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model='bar2_tColor' class="colorPicker"
                                                :disabled="cut >= 2 ? false : true">
                                            </el-color-picker>
                                        </div>
                                        <div class="block" v-show="l >= 2 && cut >= 2 ? true : false">
                                            <el-input v-model="bar2_bColor" placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 2 ? false : true">
                                                <span slot="prepend">底部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model="bar2_bColor" class="colorPicker"
                                                :disabled="cut >= 2 ? false : true">
                                            </el-color-picker>
                                        </div>

                                        <!-- 柱3颜色配置 -->
                                        <div class="block" v-show="l >= 3 && cut >= 3 ? true : false">
                                            <span class="demonstration"
                                                v-show="l >= 3 && cut >= 3 ? true : false">柱3颜色配置</span>
                                            <el-input v-model='bar3_tColor' placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 3 ? false : true">
                                                <span slot="prepend">顶部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model='bar3_tColor' class="colorPicker"
                                                :disabled="cut >= 3 ? false : true">
                                            </el-color-picker>
                                        </div>
                                        <div class="block" v-show="l >= 3 && cut >= 3 ? true : false">
                                            <el-input v-model="bar3_bColor" placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 3 ? false : true">
                                                <span slot="prepend">底部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model="bar3_bColor" class="colorPicker"
                                                :disabled="cut >= 3 ? false : true">
                                            </el-color-picker>
                                        </div>

                                        <!-- 柱4颜色配置 -->
                                        <div class="block" v-show="l >= 4 && cut >= 4 ? true : false">
                                            <span class="demonstration"
                                                v-show="l >= 4 && cut >= 4 ? true : false">柱4颜色配置</span>
                                            <el-input v-model='bar4_tColor' placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 4 ? false : true">
                                                <span slot="prepend">顶部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model='bar4_tColor' class="colorPicker"
                                                :disabled="cut >= 4 ? false : true">
                                            </el-color-picker>
                                        </div>
                                        <div class="block" v-show="l >= 4 && cut >= 4 ? true : false">
                                            <el-input v-model="bar4_bColor" placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 4 ? false : true">
                                                <span slot="prepend">底部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model="bar4_bColor" class="colorPicker"
                                                :disabled="cut >= 4 ? false : true">
                                            </el-color-picker>
                                        </div>

                                        <!-- 柱5颜色配置 -->
                                        <div class="block" v-show="l >= 5 && cut >= 5 ? true : false">
                                            <span class="demonstration"
                                                v-show="l >= 5 && cut >= 5 ? true : false">柱5颜色配置</span>
                                            <el-input v-model='bar5_tColor' placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 5 ? false : true">
                                                <span slot="prepend">顶部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model='bar5_tColor' class="colorPicker"
                                                :disabled="cut >= 5 ? false : true">
                                            </el-color-picker>
                                        </div>
                                        <div class="block" v-show="l >= 5 && cut >= 5 ? true : false">
                                            <el-input v-model="bar5_bColor" placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 5 ? false : true">
                                                <span slot="prepend">底部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model="bar5_bColor" class="colorPicker"
                                                :disabled="cut >= 5 ? false : true">
                                            </el-color-picker>
                                        </div>

                                        <!-- 柱6颜色配置 -->
                                        <div class="block" v-show="l >= 6 && cut >= 6 ? true : false">
                                            <span class="demonstration"
                                                v-show="l >= 6 && cut >= 6 ? true : false">柱6颜色配置</span>
                                            <el-input v-model='bar6_tColor' placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 6 ? false : true">
                                                <span slot="prepend">顶部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model='bar6_tColor' class="colorPicker"
                                                :disabled="cut >= 6 ? false : true">
                                            </el-color-picker>
                                        </div>
                                        <div class="block" v-show="l >= 6 && cut >= 6 ? true : false">
                                            <el-input v-model="bar6_bColor" placeholder="请选择颜色" class="input"
                                                :disabled="cut >= 6 ? false : true">
                                                <span slot="prepend">底部颜色</span>
                                            </el-input>
                                            <el-color-picker show-alpha v-model="bar6_bColor" class="colorPicker"
                                                :disabled="cut >= 6 ? false : true">
                                            </el-color-picker>
                                        </div>

                                    </el-collapse-item>
                                </el-collapse>

                            </el-collapse-item>
                        </el-collapse>

                        <!-- 折线图控制 -->
                        <el-collapse accordion>
                            <el-collapse-item title="折线图配置" name="1.1.1">

                                <!-- 标签配置 -->
                                <el-collapse accordion>
                                    <el-collapse-item title="标签配置" name="1.4">
                                        <!-- 标签是否显示 -->
                                        <el-switch v-model="line_item_show" inactive-text="标签显示">隐藏
                                        </el-switch>

                                        <!-- bar-标签位置 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="标签位置">
                                                <el-select v-model="line_item_pos" placeholder="请选择">
                                                    <el-option v-for="item in line_item_pos_options"
                                                        :key="item.line_item_pos" :label="item.label"
                                                        :value="item.line_item_pos">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>

                                        <!-- line-数据类型 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="数据类型">
                                                <el-select v-model="line_item_type" placeholder="请选择">
                                                    <el-option v-for="item in line_item_type_options"
                                                        :key="item.line_item_type" :label="item.label"
                                                        :value="item.line_item_type">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>

                                        <!-- 数据位数 -->
                                        <div class="block">
                                            <div class="block_left">
                                                <el-input v-model="line_item_fixed" placeholder="请输入" class="input">
                                                    <span slot="prepend">保留位数</span>
                                                </el-input>
                                            </div>
                                        </div>

                                    </el-collapse-item>
                                </el-collapse>

                                <!-- 线条配置 -->
                                <el-collapse accordion>
                                    <el-collapse-item title="线条配置" name="1.1.1">

                                        <!-- 线样式是否平滑 -->
                                        <el-switch v-model="smooth" inactive-text="线样式是否平滑">线样式是否平滑
                                        </el-switch>

                                        <!-- line-点样式 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="点类型">
                                                <el-select v-model="line_pon_style" placeholder="请选择">
                                                    <el-option v-for="item in line_pon_style_options"
                                                        :key="item.line_pon_style" :label="item.label"
                                                        :value="item.line_pon_style">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>

                                        <!-- 点大小 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="点大小">
                                                <el-slider v-model="line_pon_size" show-input :show-input-controls="false">
                                                </el-slider>
                                            </el-form-item>
                                        </el-form>

                                        <!-- 线粗细 -->
                                        <el-form label-width="80px" label-position="left">
                                            <el-form-item label="线粗细">
                                                <el-slider v-model="line_width" show-input :show-input-controls="false">
                                                </el-slider>
                                            </el-form-item>
                                        </el-form>

                                    </el-collapse-item>
                                </el-collapse>

                                <!-- 颜色配置 -->
                                <el-collapse accordion>
                                    <el-collapse-item title="折线图配置" name="1.1.1">

                                        <!-- 线1颜色配置 -->
                                        <el-collapse accordion v-show="l - 1 >= 0 && 1 > cut ? true : false">
                                            <el-collapse-item title="线1颜色配置" name="1.1.1">
                                                <div class="block">
                                                    <el-input v-model='bar1_tColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线左侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar1_tColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar1_bColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线右侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar1_bColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model='bar1_sColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面顶部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar1_sColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar1_xColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面底部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar1_xColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!-- 线2颜色配置 -->
                                        <el-collapse accordion v-show="l - 2 >= 0 && 2 > cut ? true : false">
                                            <el-collapse-item title="线2颜色配置" name="1.1.1">
                                                <div class="block">
                                                    <el-input v-model='bar2_tColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线左侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar2_tColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar2_bColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线右侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar2_bColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model='bar2_sColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面顶部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar2_sColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar2_xColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面底部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar2_xColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!-- 线3颜色配置 -->
                                        <el-collapse accordion v-show="l - 3 >= 0 && 3 > cut ? true : false">
                                            <el-collapse-item title="线3颜色配置" name="1.1.1">
                                                <div class="block">
                                                    <el-input v-model='bar3_tColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线左侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar3_tColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar3_bColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线右侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar3_bColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model='bar3_sColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面顶部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar3_sColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar3_xColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面底部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar3_xColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!-- 线4颜色配置 -->
                                        <el-collapse accordion v-show="l - 4 >= 0 && 4 > cut ? true : false">
                                            <el-collapse-item title="线4颜色配置" name="1.1.1">

                                                <div class="block">
                                                    <el-input v-model='bar4_tColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">左侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar4_tColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar4_bColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">右侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar4_bColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model='bar4_sColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">上侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar4_sColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar4_xColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">下侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar4_xColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!-- 线5颜色配置 -->
                                        <el-collapse accordion v-show="l - 5 >= 0 && 5 > cut ? true : false">
                                            <el-collapse-item title="线5颜色配置" name="1.1.1">

                                                <div class="block">
                                                    <el-input v-model='bar5_tColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线左侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar5_tColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar5_bColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线右侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar5_bColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model='bar5_sColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面顶部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar5_sColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar5_xColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面底部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar5_xColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!-- 线6颜色配置 -->
                                        <el-collapse accordion v-show="l - 6 >= 0 && 6 > cut ? true : false">
                                            <el-collapse-item title="线6颜色配置" name="1.1.1">
                                                <div class="block">
                                                    <el-input v-model='bar6_tColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线左侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar6_tColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar6_bColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">线右侧颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar6_bColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model='bar6_sColor' placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面顶部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model='bar6_sColor' class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                                <div class="block">
                                                    <el-input v-model="bar6_xColor" placeholder="请选择颜色" class="input">
                                                        <span slot="prepend">面底部颜色</span>
                                                    </el-input>
                                                    <el-color-picker show-alpha v-model="bar6_xColor" class="colorPicker">
                                                    </el-color-picker>
                                                </div>
                                            </el-collapse-item>
                                        </el-collapse>

                                    </el-collapse-item>
                                </el-collapse>

                            </el-collapse-item>
                        </el-collapse>

                    </el-tab-pane>
                </el-tabs>
            </el-drawer>
        </div>
        <div class="chart" ref="chart"></div>
    </div>
</template>
  
<script>
import XLSX from "xlsx";
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import axios from 'axios'
var vm = null

export default {
    data() {
        return {
            myChart: null,
            drawer: false,
            data_1: [],
            data_2: [],
            data_3: [],
            data_4: [],
            // grid
            width_dis: 10,
            height_dis: 30,
            customText_show: false,
            customText: '',

            // line
            line_item_show: true,
            line_item_type: 0,
            line_item_fixed: 2,
            line_item_type_options: [
                {
                    line_item_type: 0,
                    label: '默认'
                },
                {
                    line_item_type: 1,
                    label: '百分数'
                },
                {
                    line_item_type: 2,
                    label: '小数'
                },
            ],
            line_width: 2,
            line_pon_style: 'circle',
            line_pon_style_options: [
                {
                    line_pon_style: 'none',
                    label: '不显示'
                },
                {
                    line_pon_style: 'circle',
                    label: '圆点形'
                },
                {
                    line_pon_style: 'rect',
                    label: '正方形'
                },
                {
                    line_pon_style: 'roundRect',
                    label: '圆角正方形'
                },
                {
                    line_pon_style: 'triangle',
                    label: '三角形'
                },
                {
                    line_pon_style: 'diamond',
                    label: '菱形'
                },
                {
                    line_pon_style: 'pin',
                    label: '指针形'
                },
                {
                    line_pon_style: 'arrow',
                    label: '箭头形'
                },
            ],
            line_pon_size: 8,

            // bar
            bar_item_type: 0,
            bar_item_fixed: 2,
            bar_item_type_options: [
                {
                    bar_item_type: 0,
                    label: '默认'
                },
                {
                    bar_item_type: 1,
                    label: '百分数'
                },
                {
                    bar_item_type: 2,
                    label: '小数'
                },
            ],

            // 标题
            title_text: "2018-2023年杭州市摇号情况",
            title_left: 50,
            title_top: 0,
            title_color: "rgba(0,0,0,1)",
            title_size: 20,
            title_bg_color: "rgba(255,255,255,0)",

            // 图例
            leg_h_v: true,
            leg_show: true,
            leg_left: 50,
            leg_top: 5,
            leg_text_color: "rgba(0,0,0,1)",
            leg_text_size: 12,
            legendWidth: 0,

            //x轴
            x_data: [],
            x_label_show: true,
            x_font_color: 'rgba(0,0,0,1)',
            x_font_size: 12,
            x_font_bold: true,
            x_line_show: true,
            x_rotate: 0,

            //yl轴
            yl_unit: '单位',
            yl_label_show: true,
            yl_line_show: true,
            yl_font_bold: true,
            yl_font_color: 'rgba(0,0,0,1)',
            yl_font_size: 12,

            //yr轴
            yr_unit: '单位',
            yr_label_show: true,
            yr_line_show: true,
            yr_font_bold: true,
            yr_font_color: 'rgba(0,0,0,1)',
            yr_font_size: 12,

            // bar
            bar_item_show: true,
            bar_item_pos: 'top',
            bar_item_pos_options: [
                {
                    bar_item_pos: 'top',
                    label: '外部顶部'
                },
                {
                    bar_item_pos: 'left',
                    label: '外部左侧'
                },
                {
                    bar_item_pos: 'right',
                    label: '外部右侧'
                },
                {
                    bar_item_pos: 'bottom',
                    label: '外部底部'
                },
                {
                    bar_item_pos: 'inside',
                    label: '内部居中'
                },
                {
                    bar_item_pos: 'insideLeft',
                    label: '内部左侧'
                },
                {
                    bar_item_pos: 'insideRight',
                    label: '内部右侧'
                },
                {
                    bar_item_pos: 'insideTop',
                    label: '内部顶部'
                },
                {
                    bar_item_pos: 'insideBottom',
                    label: '内部底部'
                }
            ],
            l: 3,
            bar1_tColor: 'rgba(92,110,150,1)',
            bar2_tColor: 'rgba(67, 163, 232, 1)',
            bar3_tColor: 'rgba(25, 202, 173, 1)',
            bar4_tColor: 'rgba(140, 199, 181, 1)',
            bar5_tColor: 'rgba(160, 238, 225, 1)',
            bar6_tColor: 'rgba(190, 231, 233, 1)',
            bar1_bColor: 'rgba(92,110,150,1)',
            bar2_bColor: 'rgba(67, 163, 232, 1)',
            bar3_bColor: 'rgba(25, 202, 173, 1)',
            bar4_bColor: 'rgba(140, 199, 181, 1)',
            bar5_bColor: 'rgba(160, 238, 225, 1)',
            bar6_bColor: 'rgba(190, 231, 233, 1)',
            tColors: [],
            bColors: [],

            // line
            line_item_show: true,
            line_item_pos: 'top',
            line_item_pos_options: [
                {
                    line_item_pos: 'top',
                    label: '外部顶部'
                },
                {
                    line_item_pos: 'left',
                    label: '外部左侧'
                },
                {
                    line_item_pos: 'right',
                    label: '外部右侧'
                },
                {
                    line_item_pos: 'bottom',
                    label: '外部底部'
                }
            ],
            bar1_sColor: 'rgba(0,0,0,0)',
            bar2_sColor: 'rgba(0,0,0,0)',
            bar3_sColor: 'rgba(0,0,0,0)',
            bar4_sColor: 'rgba(0,0,0,0)',
            bar5_sColor: 'rgba(0,0,0,0)',
            bar6_sColor: 'rgba(0,0,0,0)',
            bar1_xColor: 'rgba(0,0,0,0)',
            bar2_xColor: 'rgba(0,0,0,0)',
            bar3_xColor: 'rgba(0,0,0,0)',
            bar4_xColor: 'rgba(0,0,0,0)',
            bar5_xColor: 'rgba(0,0,0,0)',
            bar6_xColor: 'rgba(0,0,0,0)',
            sColors: [],
            xColors: [],
            smooth: false,

            // 样式配置参数
            border_dis: 10,
            height_dis: 30,
            top: 5,
            left: 50,
            backgroundColor: '',
            titleColor: '#000000',
            textColor: '#000000',
            xLabelColor: '#000000',
            yLabelColor: '#000000',
            y2LabelColor: '#000000',
            fontSize: 16,
            radius: 6,
            customText: '自定义文案',
            customText_show: true,
            x_show: true,
            y_show: true,
            y2_show: true,
            x_unit: '年份',
            y_unit: '单位:万人次',
            y2_unit: '人均次数',
            imageUrl: '',
            theme: [
                { value: '明亮', colors: ['#4992ff', '#7cffb2', '#fddd60', '#58d9f9', '#05c091', '#ff8a45'] },
                { value: '粉青', colors: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb"] },
                { value: '蓝绿', colors: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"] },
                { value: '橘红', colors: ["#893448", "#d95850", "#eb8146", "#ffb248", "#f2d643", "#ebdba4"] },
                { value: '青草', colors: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"] },
                { value: '复古', colors: ["#e01f54", "#5e4ea5", "#f5e8c8", "#b8d2c7", "#c6b38e", "#a4d8c2"] },

            ],
            currentTheme: '',

            legendWidth: 0,

            listTable: [],
            name_list: ['年份', '人数', '人次', '人均次数'],
            cut: 1
        };
    },
    created() {
        vm = this
    },
    async mounted() {
        // methods.initWatermark()
        await this.getData() //获取摇号数据
        // 初始化图表
        this.myChart = echarts.init(this.$refs.chart)
        this.drawChart()
        this.get_itemWidth()
        this.initListenToDiv(this.$refs.chart)
    },
    computed: {
        change() {
            const {
                //line
                line_item_type,
                line_item_fixed,
                line_width,
                line_pon_style,
                line_pon_size,
                // bar
                bar_item_type,
                bar_item_fixed,
                // title
                title_text,
                title_top,
                title_left,
                title_size,
                title_color,
                title_bg_color,
                // leg
                leg_h_v,
                leg_show,
                leg_left,
                leg_top,
                leg_text_color,
                // x
                x_label_show,
                x_unit,
                x_font_color,
                x_font_size,
                x_font_bold,
                x_line_show,
                x_rotate,
                //yl
                yl_font_bold,
                yl_font_color,
                yl_line_show,
                yl_label_show,
                yl_font_size,
                yl_unit,
                //yr
                yr_font_bold,
                yr_font_color,
                yr_line_show,
                yr_label_show,
                yr_font_size,
                yr_unit,
                // grid
                width_dis,
                height_dis,
                customText_show,
                customText,
                // bar
                bar_item_show,
                bar_item_pos,
                radius,
                bar1_tColor,
                bar1_bColor,
                bar2_tColor,
                bar2_bColor,
                bar3_tColor,
                bar3_bColor,
                bar4_tColor,
                bar4_bColor,
                bar5_tColor,
                bar5_bColor,
                bar6_tColor,
                bar6_bColor,
                bar1_sColor,
                bar2_sColor,
                bar3_sColor,
                bar4_sColor,
                bar5_sColor,
                bar6_sColor,
                bar1_xColor,
                bar2_xColor,
                bar3_xColor,
                bar4_xColor,
                bar5_xColor,
                bar6_xColor,
                // line
                line_item_show,
                line_item_pos,
                smooth,
                cut,
            } = this
            return {
                //line
                line_item_type,
                line_item_fixed,
                line_width,
                line_pon_style,
                line_pon_size,
                // bar
                bar_item_type,
                bar_item_fixed,
                // title
                title_text,
                title_top,
                title_left,
                title_size,
                title_color,
                title_bg_color,
                // leg
                leg_h_v,
                leg_show,
                leg_left,
                leg_top,
                leg_text_color,
                // x
                x_label_show,
                x_unit,
                x_font_color,
                x_font_size,
                x_font_bold,
                x_line_show,
                x_rotate,
                //yl
                yl_font_bold,
                yl_font_color,
                yl_line_show,
                yl_label_show,
                yl_font_size,
                yl_unit,
                //yr
                yr_font_bold,
                yr_font_color,
                yr_line_show,
                yr_label_show,
                yr_font_size,
                yr_unit,
                // grid
                width_dis,
                height_dis,
                customText_show,
                customText,
                // bar
                bar_item_show,
                bar_item_pos,
                radius,
                bar1_tColor,
                bar1_bColor,
                bar2_tColor,
                bar2_bColor,
                bar3_tColor,
                bar3_bColor,
                bar4_tColor,
                bar4_bColor,
                bar5_tColor,
                bar5_bColor,
                bar6_tColor,
                bar6_bColor,
                bar1_sColor,
                bar2_sColor,
                bar3_sColor,
                bar4_sColor,
                bar5_sColor,
                bar6_sColor,
                bar1_xColor,
                bar2_xColor,
                bar3_xColor,
                bar4_xColor,
                bar5_xColor,
                bar6_xColor,
                // line
                line_item_show,
                line_item_pos,
                smooth,
                cut,
            }
        }
    },
    watch: {
        legendWidth: {
            deep: true,
            immediate: true,
            handler: async function (newval, oldval) {
                if (this.myChart) {
                    // this.myChart.dispose()
                    this.drawChart()
                }
            }
        },
        change() {
            if (this.myChart) {
                this.drawChart()
            }
        },
    },
    methods: {
        initListenToDiv(ref) {
            let erd = elementResizeDetectorMaker()
            let that = this
            erd.listenTo(ref, () => {
                that.$nextTick(function () {
                    //使echarts尺寸重置
                    that.myChart.resize()
                })
            })
        },
        // 分享链接
        copy() {
            this.$message({
                message: '分享链接已复制到剪贴板',
                type: 'success'
            });
            let sharelink = location.href;
            this.$copyText(sharelink).then(
                res => {
                    console.log(res.text)
                },
                err => {
                    console.log(err)
                }
            )
        },
        async getData() {
            await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_ADD_NUM_ONEYEAR_AND_ALLYEAAR")
                .then(res => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        this.x_data.push(res.data.data[i].NAME)
                        this.data_1.push(parseFloat((res.data.data[i].NUM_RENCI / 10000).toFixed(2)))
                        this.data_2.push(parseFloat((res.data.data[i].NUM_RENSHU / 10000).toFixed(2)))
                        this.data_3.push(parseFloat((res.data.data[i].RENCI_DIVISION_RENSHU).toFixed(2)))
                    }
                    this.listTable.push(this.x_data, this.data_1, this.data_2, this.data_3)
                })
        },
        get_itemWidth() {
            const chartOptions = this.myChart.getOption()
            const legendData = chartOptions.series
            const fontsize = chartOptions.legend[0].textStyle.fontSize
            const itemWidth = chartOptions.legend[0].itemWidth
            const itemGap = chartOptions.legend[0].itemGap
            this.legendWidth = 0
            for (let i = 0; i < legendData.length; i++) {
                var length = legendData[i].name.length
                var fontwidth = length * fontsize
                this.legendWidth = this.legendWidth + fontwidth + itemWidth
            }
            var len = legendData.length - 1
            this.legendWidth = this.legendWidth + itemGap * len
        },
        drawChart() {
            // 1. 实例化对象
            // var myChart = echarts.init(document.querySelector(".line .chart"));
            // 2.指定配置
            var series = []
            // this.tColors = []
            // this.bColors = []
            this.tColors = [this.bar1_tColor, this.bar2_tColor, this.bar3_tColor, this.bar4_tColor, this.bar5_tColor, this.bar6_tColor]
            this.bColors = [this.bar1_bColor, this.bar2_bColor, this.bar3_bColor, this.bar4_bColor, this.bar5_bColor, this.bar6_bColor]
            this.sColors = [this.bar1_sColor, this.bar2_sColor, this.bar3_sColor, this.bar4_sColor, this.bar5_sColor, this.bar6_sColor]
            this.xColors = [this.bar1_xColor, this.bar2_xColor, this.bar3_xColor, this.bar4_xColor, this.bar5_xColor, this.bar6_xColor]
            // console.log(this.tColors)
            // this.myChart.clear()
            for (var i = 1; i < this.name_list.length; i++) {
                if (i <= this.cut) {
                    series.push(
                        {
                            name: this.name_list[i],
                            yAxisIndex: 0,
                            // stack: '总量',
                            type: 'bar',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: vm.tColors[i - 1],
                                    }, {
                                        offset: 1,
                                        color: vm.bColors[i - 1],
                                    }]
                                ),
                                borderRadius: this.radius / 2,
                            },
                            barWidth: '30%',
                            label: {
                                show: this.bar_item_show,
                                position: this.bar_item_pos,
                                formatter: '{c}',
                                color: this.textColor,
                                zindex: 2,
                                fontSize: 16,
                                formatter: (b) => {
                                    if (this.bar_item_type == '0') {
                                        return b.value
                                    }
                                    else if (this.bar_item_type == '1') {
                                        return (Number(b.value) * 100).toFixed(this.bar_item_fixed) + '%'
                                    }
                                    else {
                                        return Number(b.value).toFixed(this.bar_item_fixed)
                                    }
                                },
                            },
                            data: this.listTable[i]
                        },
                    )
                }
                else {
                    series.push(
                        {
                            name: this.name_list[i],
                            yAxisIndex: 1,
                            type: 'line',
                            symbol: this.line_pon_style,
                            symbolSize: this.line_pon_size,
                            smooth: this.smooth,
                            label: {
                                show: this.line_item_show,
                                position: this.line_item_pos,
                                // formatter: '{c}次',
                                color: this.textColor,
                                fontSize: 16,
                                formatter: (b) => {
                                    if (this.line_item_type == '0') {
                                        return b.value
                                    }
                                    else if (this.line_item_type == '1') {
                                        return (Number(b.value) * 100).toFixed(this.line_item_fixed) + '%'
                                    }
                                    else {
                                        return Number(b.value).toFixed(this.line_item_fixed)
                                    }
                                },
                            },
                            lineStyle: {
                                width: this.line_width,
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: vm.tColors[i - 1],
                                    },
                                    {
                                        offset: 1,
                                        color: vm.bColors[i - 1],
                                    },
                                ]),
                                // shadowColor: 'rgba(255, 120, 0,1)',
                                // shadowBlur: 8,
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: vm.sColors[i - 1],
                                    },
                                    {
                                        offset: 1,
                                        color: vm.xColors[i - 1],
                                    },
                                ]),
                            },
                            data: this.listTable[i]
                        },
                    )
                }
            }

            var option = {
                backgroundColor: 'white',
                title: {
                    backgroundColor: this.title_bg_color,
                    text: this.title_text,
                    textAlign: 'center',
                    left: this.title_left + '%',
                    top: this.title_top + '%',
                    textStyle: {
                        color: this.title_color,
                        fontSize: this.title_size,
                    }
                },
                toolbox: {
                    feature: {
                        mark: {
                            show: true
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack']
                        },
                        restore: { show: true },
                        saveAsImage: {
                            show: true
                        },
                    }
                },
                graphic: [{
                    type: 'text',
                    ignore: this.customText_show,
                    draggable: true,
                    top: 'center',
                    right: 'center',
                    style: {
                        text: this.customText,
                        font: '14px Helvetica Neue',
                        height: '1.0625rem '
                    },
                    z: 1000
                },
                ],
                grid: {
                    top: this.height_dis / 2 + "%",
                    left: this.width_dis / 2 + '%',
                    right: this.width_dis / 2 + '%',
                    bottom: this.height_dis / 2 + "%",
                    containLabel: true
                },
                legend: {
                    type: 'plain',
                    // data: this.name_list.slice(1),
                    orient: this.leg_h_v ? 'horizontal' : 'vertical',
                    show: this.leg_show,
                    left: this.leg_left + '%',
                    top: this.leg_top + "%",
                    textStyle: {
                        color: this.leg_text_color,
                        fontSize: this.leg_text_size,
                    },
                    padding: [0, 0, 0, -this.legendWidth / 2]
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    show: true,
                    // borderGap:"30%",
                    type: 'category',
                    nameTextStyle: {
                        color: this.x_font_color,
                    },
                    data: this.listTable[0],
                    axisLine: {
                        show: this.x_line_show,
                        lineStyle: {
                            color: '#B5B5B5',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        margin: 20, //刻度标签与轴线之间的距离。
                        interval: 0, // 强制全部显示
                        rotate: this.x_rotate, //标签倾斜度数
                        show: this.x_label_show,
                        fontFamily: 'Microsoft YaHei',
                        color: this.x_font_color,
                        fontSize: this.x_font_size,
                        fontStyle: this.x_font_bold ? 'bold' : '',
                    },
                },
                yAxis: [
                    {
                        name: this.yl_unit,
                        alignTicks: true,
                        nameTextStyle: {
                            color: this.yl_font_color,
                            fontSize: this.yl_font_size,
                        },
                        type: 'value',
                        axisLine: {
                            show: this.yl_line_show,
                            lineStyle: {
                                color: '#B5B5B5',
                            },
                        },
                        splitLine: {
                            show: this.yl_line_show,
                            lineStyle: {
                                // 使用深浅的间隔色
                                color: ["#B5B5B5"],
                                type: "dashed",
                                opacity: 0.3,
                            },
                        },
                        axisLabel: {
                            show: this.yl_label_show,
                            fontFamily: 'Microsoft YaHei',
                            color: this.yl_font_color,
                            fontSize: this.yl_font_size,
                            fontStyle: this.yl_font_bold ? 'bold' : '',
                            formatter: (value, index) => {
                                if (vm.bar_item_type == '0') {
                                    return value
                                }
                                else if (vm.bar_item_type == '1') {
                                    return (Number(value) * 100).toFixed(0) + '%'
                                }
                                else {
                                    return Number(value).toFixed(0)
                                }
                            },
                        },
                    },
                    {
                        name: this.yr_unit,
                        // alignTicks: true,
                        nameTextStyle: {
                            color: this.yr_font_color,
                            fontSize: this.yr_font_size,
                        },
                        type: 'value',
                        axisLine: {
                            show: this.yr_line_show,
                            lineStyle: {
                                color: '#B5B5B5',
                            },
                        },
                        splitLine: {
                            show: this.yr_line_show,
                            lineStyle: {
                                // 使用深浅的间隔色
                                color: ["#B5B5B5"],
                                type: "dashed",
                                opacity: 0.3,
                            },
                        },
                        axisLabel: {
                            show: this.yr_label_show,
                            fontFamily: 'Microsoft YaHei',
                            color: this.yr_font_color,
                            fontSize: this.yr_font_size,
                            fontStyle: this.yr_font_bold ? 'bold' : '',
                            formatter: function (value, index) {
                                if (vm.line_item_type == '0') {
                                    return value
                                }
                                else if (vm.line_item_type == '1') {
                                    return (Number(value) * 100).toFixed(0) + '%'
                                }
                                else {
                                    return Number(value).toFixed(0)
                                }
                            }
                        },
                    },
                ],
                series: series

            }
            // // 3. 把配置项给实例对象
            this.myChart.setOption(option, true)
        },
        uploadFile(params) {
            // console.log(params);
            const _file = params.file;
            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
                try {

                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                        type: 'binary'
                    });

                    for (let sheet in workbook.Sheets) {
                        const sheetHeader = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { raw: false, header: 1 })

                        const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { raw: false });
                        if (sheetArray.length == 0) {
                            continue;
                        }
                        // console.log("读取文件", sheetArray)
                        this.l = sheetHeader[0].length - 1
                        this.listTable = []
                        this.name_list = []
                        this.name_list = sheetHeader[0]
                        console.log(this.name_list, this.l)
                        if (sheetHeader == 0 || sheetHeader == sheetHeader.length - 1) {
                            continue;
                        }
                        for (let i in sheetHeader[0]) {
                            let li = []
                            let name = sheetHeader[0][i];
                            // console.log(name);
                            [...sheetArray].map(x => li.push(x[name]))

                            this.listTable.push(li)

                        }
                        console.log(this.listTable)

                        this.drawChart();
                        this.get_itemWidth()
                    }
                } catch (e) {
                    console.log(e)
                }
            };
            fileReader.readAsBinaryString(_file)


        },
        exceed() {
            console.log("只能上传一个文件")
        },
        remove() { },
    }
};
</script>
  
<style lang="less" scoped>
.Lbody {
    width: 100%;
    height: 100%;
}

.chart {
    width: 100%;
    height: calc(100% - 40px);
}

.box_fex {
    display: flex;
    width: 100%;
    height: 40px;
}

/deep/ .el-slider__input {
    width: 10%;
    min-width: 55px;
}

/deep/ .el-slider__runway.show-input {
    width: 60%;
}

/deep/ .el-collapse-item__content {
    padding-bottom: 0px;
}

/deep/ .el-drawer__container {
    position: relative;
    left: 0;
    right: 0;
    width: 100%;
}

.eldrawer /deep/ .el-drawer {
    width: 15% !important;
    min-width: 350px !important;
}

.el-collapse-item {
    width: 92%;
    margin: auto;
}

.el-drawer__header {
    margin-bottom: 20px;
}

.block {
    display: block;
    width: 100%;
    height: 100%;
    margin-bottom: 5%;
}


.block_left {
    flex-grow: 1;
}

.input {
    width: 80%;
}

.colorPicker {
    position: absolute;
}

.block_right {
    width: 40px;
}

.el-color-picker {
    position: absolute;
}

.el-form-item {
    margin-bottom: 5%;
    // margin-top: 20px;
}

.el-switch {
    margin-bottom: 5%;
}

.col-head {
    width: auto;
    height: 32px;
    text-align: center;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
    margin-bottom: 8px;

    .col-head-text {
        display: inline-block;
        line-height: 32px;
        vertical-align: middle;
    }

    .icons {
        height: 25px;
        width: 25px;
        vertical-align: middle;

    }
}

.theme-plan-group {
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: auto;
    height: 32px;
    overflow: hidden;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
    margin-bottom: 8px;
    cursor: pointer;

    .theme-plan-text {
        width: 32px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-right: 30px;
        display: inline-block;
        border-radius: 3px;
        font-family: "Hiragino Sans GB";
    }

    .theme-plan-color {
        width: 32px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        margin-left: 5px;
        margin-right: 2px;
        display: inline-block;
        border-radius: 3px;
    }
}

.el-radio {
    display: block;
    margin: 10px 0;
}
</style>
  