<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px">
      <div class="text item">
        <el-collapse v-model="activeState" @change="handleChange">
          <el-collapse-item title="执行状态" name="1" style="margin-top: 10px">
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item label="执行用户">{{ taskInfoData.created_by }}</el-descriptions-item>
              <el-descriptions-item label="开始时间">{{ taskInfoData.create_at }}</el-descriptions-item>
              <el-descriptions-item label="结束时间">{{ taskInfoData.update_at }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag size="small">{{ taskInfoData.state }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>

          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px">
      <div class="text item">
        <el-collapse v-model="activeBrief" @change="handleChange">
          <el-collapse-item title="结果概览" name="1" style="margin-top: 10px">
            <el-table
              :data="taskStatsData"
              style="width: 100%"
            >
              <el-table-column
                prop="host"
                label="目标"
                width="180"
              />
              <el-table-column
                prop="ok"
                label="ok"
                width="180"
              />
              <el-table-column
                prop="changed"
                label="changed"
              />
              <el-table-column
                prop="dark"
                label="dark"
              />
              <el-table-column
                prop="failures"
                label="failures"
              />
              <el-table-column
                prop="ignored"
                label="ignored"
              />
              <el-table-column
                prop="rescued"
                label="rescued"
              />
              <el-table-column
                prop="skipped"
                label="skipped"
              />
            </el-table>

          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px">
      <div class="text item">
        <el-collapse v-model="activeRepository" @change="handleChange">
          <el-collapse-item title="仓库详情" name="1" style="margin-top: 10px">
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item label="项目ID">{{ repositoryData.id }}</el-descriptions-item>
              <el-descriptions-item label="项目名">{{ repositoryData.name }}</el-descriptions-item>
              <el-descriptions-item label="包名">{{ repositoryData.name }}</el-descriptions-item>
              <el-descriptions-item label="入口文件">{{ repositoryData.main }}</el-descriptions-item>
              <el-descriptions-item label="创建用户">{{ repositoryData.created_by }}</el-descriptions-item>
              <el-descriptions-item label="更新用户">{{ repositoryData.updated_by }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ repositoryData.create_at }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ repositoryData.update_at }}</el-descriptions-item>
              <el-descriptions-item label="备注">
                {{ repositoryData.describe }}
              </el-descriptions-item>
            </el-descriptions>

          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px">
      <div class="text item">
        <el-collapse v-model="activeLog" @change="handleChange">
          <el-collapse-item title="完整日志" name="1" style="margin-top: 10px">
            <!--                        <pre id="statusLog"></pre>-->
            <!--            <codemirror-->
            <!--              ref="mycode"-->
            <!--              :value="anslog"-->
            <!--              :options="cmOptions"-->
            <!--              class="code"-->
            <!--              @ready="onCmReady3"-->
            <!--            />-->
            <div>
              <pre class=" line-numbers" style="height: 600px; ">
                    <code class="language-yaml line-numbers copy-to-clipboard" v-html="anslog" />
                </pre>
            </div>

          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>

</template>

<script>
import Prism from 'prismjs'// 引入插件
import { Task as masterApi } from '@/api/iac' // 引入控制主题，没有的话主题不起效果
import { REPOSITORY as repositoryApi } from '@/api/iac'
import { TaskStats as taskStatsApi } from '@/api/iac'
// import { codemirror } from 'vue-codemirror'
import Term from 'ansi_up'

const ansiUp = new Term()
import 'codemirror/theme/ambiance.css' // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require('codemirror/mode/javascript/javascript') // 这里引入的模式的js
import 'codemirror/theme/material.css'
// import Json2yaml from 'json2yaml'
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
export default {
  name: 'Detail',
  // components: {
  //   codemirror
  // },
  data() {
    return {
      dialogCreateTitle: '新增项目',
      dialogUpdateTitle: '更新项目',
      dialogWidth: '50%',
      anslog: '',
      taskInfoData: {},
      repositoryData: {},
      taskStatsData: [],
      activeLog: ['1'],
      activeState: ['1'],
      activeBrief: ['1'],
      activeRepository: ['1'],
      cmOptions: { // 配置项
        tabSize: 4, // 制表符的宽度
        mode: 'text/x-yaml', // 使用的模式
        // mode: 'python', // 使用的模式
        theme: 'material', // 主题黑色
        // theme: 'darcula', // 主题白色
        lineNumbers: true, // 是否显示行号
        lineWrapping: true, // 是否应滚动或换行以显示长行
        extraKeys: { 'Ctrl': 'autocomplete' },
        lineWiseCopyCut: true, // 在没有选择的情况下进行复制或剪切将复制或剪切有光标的整行。
        showCursorWhenSelecting: true, // 选择处于活动状态时是否应绘制光标
        maxHighlightLength: Infinity, // 显示长行的时候 这个值是不限制，如果要做限制的话，值是number类型
        matchBrackets: true, // 光标匹配括号
        line: true,
        readOnly: true // 只读
      }
    }
  },
  created() {
    if (!this.$route.query.id) return false
    this.GetList(this.$route.query.id)
    this.getTaskStats(this.$route.query.id)
  },
  mounted() {
    // 高亮渲染
    Prism.highlightAll()
  },
  methods: {
    getTaskStats(id) {
      taskStatsApi.list({ 'task_record': id }).then(res => {
        this.taskStatsData = res.data
      })
    },
    getRepository(id) {
      repositoryApi.get(id).then(res => {
        this.repositoryData = res.data
      })
    },
    onCmReady3() {
      this.$refs.mycode.codemirror.setSize('100%', '100%')
    },
    handleChange(val) {
      console.log(val)
    },
    GetList(id) {
      masterApi.get(id).then(response => {
        this.taskInfoData = response.data.result ? response.data.result : response.data
        this.getRepository(response.data.repository)
        this.anslog = ansiUp.ansi_to_html(this.taskInfoData.output)
        Prism.highlightAll()
        // var html = ansiUp.ansi_to_html(this.taskInfoData.output)
        // var statusLog = document.getElementById('statusLog') // statusLog 即是页面需要展示内容的div
        //
        // statusLog.innerHTML = html
      })
    }
  }
}
</script>

<style scoped>
pre {
  position: relative;
}
.pre-numbering {
  position: absolute;
  top: 0;
  left: -30px;
  width: 30px;
  border-right: 1px solid #C3CCD0;
  background-color: #012ce3;
  text-align: center;
  padding: 0.5em 0;
}

.pre-numbering li {
  list-style: none;
  color: #AAA;
  font-size: 1em;
}
.codemirror {
  overscroll-y: scroll !important;
  height: auto !important;
}

.title {
  font-size: 44px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #303133;
  padding-bottom: 17px;
  padding-top: 17px;
}

::v-deep .el-collapse-item__header.is-active {
  border-bottom: 1px solid #ebeef5;
  font-size: 25px;
}

::v-deep .el-collapse-item__header {
  font-size: 20px;
}

::v-deep .el-collapse-item__wrap {
  border: none;
}

p {
  margin: 0;
  padding: 0;
}

.row {
  overflow: hidden;
  margin-bottom: 22px;
}

.row .col_left {
  float: left;
  width: 420px;
}

.row .col_right {
  float: left;
}
</style>
