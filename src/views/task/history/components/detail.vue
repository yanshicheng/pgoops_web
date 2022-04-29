<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div class="text item" style="margin-right: 10px">
        <el-row>
          <div>
            <el-progress v-if="taskHistoryDetail.status === '异常' " :stroke-width="25" :percentage="30" status="exception" />
            <el-progress v-else-if="taskHistoryDetail.status === '执行中'" :text-inside="true" :stroke-width="25" :percentage="80" status="warning" />
            <el-progress v-else :text-inside="true" :stroke-width="25" :percentage="100" :format="format" status="success" />
          </div>
          <el-col :span="24">
            <div style="margin-top: 10px">
              <el-descriptions class="margin-top" title="任务概述" :column="4" border>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-info" />
                    任务标题
                  </template>
                  {{ taskHistoryDetail.title }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-position" />
                    task_id
                  </template>
                  {{ taskHistoryDetail.task_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-wallet" />
                    执行方法
                  </template>
                  {{ taskHistoryDetail.run_mode }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tickets" />
                    任务类型
                  </template>
                  {{ taskHistoryDetail.task_type }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-user" />
                    执行用户
                  </template>
                  {{ taskHistoryDetail.src_user }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-location-outline" />
                    来源IP
                  </template>
                  {{ taskHistoryDetail.src_ip }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-alarm-clock" />
                    创建时间
                  </template>
                  {{ taskHistoryDetail.create_at }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-timer" />
                    完成时间
                  </template>
                  {{ taskHistoryDetail.update_at }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-chat-dot-round" />
                    备注
                  </template>
                  {{ taskHistoryDetail.remark }}
                </el-descriptions-item>
              </el-descriptions>

            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div style="margin-top: 10px; margin-right: 5px">
              <el-descriptions class="margin-top" title="任务参数" :column="1" border>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-monitor" />
                    目标主机
                  </template>
                  <el-tag size="small">{{ taskHistoryDetail.target }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-more" />
                    执行模块
                  </template>
                  <el-tag size="small" type="info">{{ taskHistoryDetail.module }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-document-add" />
                    模块方法
                  </template>
                  <el-tag size="small" type="info">{{ taskHistoryDetail.method }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tickets" />
                    任务参数
                  </template>
                  <el-tag size="small" type="info">{{ taskHistoryDetail.args }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-question" />
                    任务状态
                  </template>
                  <el-tag size="small" type="success">{{ taskHistoryDetail.status }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-alarm-clock" />
                    耗时(s)
                  </template>
                  <el-tag size="small">{{ taskHistoryDetail.run_time }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>

            </div>

          </el-col>
          <el-col :span="16">
            <div style=" margin-top:10px; width:100%;">
              <div style="margin-outside: 30px">
                <span style="font-size: 16px; font-weight: bold;margin: 0; ">完整日志</span>
              </div>
              <div style="margin-top: 20px">
                <!--                <code class="language-yaml " v-html="resultYaml"></code>-->
                <pre class="language-yaml " style="height: 350px; ">
                    <code class="line-numbers copy-to-clipboard" v-html="resultYaml" />
                </pre>
              </div>

              <!--              <pre v-highlight style="margin: 0; margin-top: 2px ">-->
              <!--                <code class="css" style="height: 300px;margin: 0;" v-html="resultYaml"></code>-->
              <!--              </pre>-->

            </div>
          </el-col>
        </el-row>

      </div>
    </el-card>
  </div>

</template>

<script>

import Prism from 'prismjs'// 引入插件
import 'prismjs/themes/prism-tomorrow.css'
import { TaskHistory as masterApi } from '@/api/task'
import Json2yaml from 'json2yaml'

export default {
  name: 'Detail',
  props: {
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: {
        language: 'yaml',
        theme: 'vs-dark',
        selectOnLineNumbers: false,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        glyphMargin: true
      },
      resultYaml: '',
      taskHistoryDetail: {}
    }
  },
  // watch: {
  //   text(newValue, oldValue) {
  //     this.$nextTick(() => {
  //       Prism.highlightAll()
  //     });
  //   }
  // },

  created() {
    if (!this.$route.query.id) return false
    this.GetList(this.$route.query.id)
  },
  methods: {
    GetList(id) {
      masterApi.get(id).then(res => {
        this.taskHistoryDetail = res.data
        var jsonResult = res.data.result
        if (jsonResult !== null && jsonResult !== undefined) {
          if (Array.isArray(jsonResult['return'])) {
            for (var key in jsonResult.return[0]) {
              jsonResult.return[0][key] = jsonResult.return[0][key].replace(/\n/g, '<br/>')
            }
          } else {
            jsonResult.return = jsonResult.return.replace(/\n/g, '<br>')
          }
        } else {
          jsonResult = { return: '任务调度中' }
        }

        // console.log('1', jsonResult)

        // this.text(this.resultYaml)
        // this.resultYaml = 123;
        this.$nextTick(() => {
          this.resultYaml = Json2yaml.stringify(jsonResult)
          Prism.highlightAll()
        })

        // this.resultYaml = Json2yaml.stringify(jsonResult)
      })
    },
    format(percentage) {
      return percentage === 100 ? '完成' : `${percentage}%`
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
  background-color: #1C1D21;
  text-align: center;
  padding: 0.5em 0;
}

.pre-numbering li {
  list-style: none;
  color: #AAA;
  font-size: 1em;
}

</style>
