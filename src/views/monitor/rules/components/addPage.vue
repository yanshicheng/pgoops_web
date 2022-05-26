<template>
  <div>
    <el-dialog
      :title="methodVisible==='create'?dialogCreateTitle:dialogUpdateTitle"
      :width="dialogWidth"
      :visible.sync="isVisibleShow"
      :close-on-click-modal="false"
      style="height: 600px;overflow: auto;"
      @close="closeForm('addFormData')"
    >
      <el-form ref="addFormData" :model="addFormData" label-width="30%" class="demo-ruleForm">
        <el-form-item label="规则名称: " required prop="name">
          <el-input v-model="addFormData.name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="应用组: " required prop="group">
          <el-select v-model="addFormData.group" placeholder="请选择应用组">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用: " required prop="status">
          <el-switch
            v-model="addFormData.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="PromeQL: " required prop="promeql">
          <el-input v-model="addFormData.promeql" style="width: 60%" />
          <el-button
            v-if="addFormData.promeql"
            size="small"
            type="primary"
            style="margin-left: 10px"
            @click="executeQuery"
          >测试
          </el-button>
          <el-button v-else size="small" type="primary" disabled style="margin-left: 10px">测试</el-button>
        </el-form-item>
        <el-form-item label="触发条件: " required prop="condition">
          <el-select v-model="addFormData.condition" placeholder="请选择">
            <el-option
              v-for="item in conditionChoices"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="触发阈值: " required prop="threshold_value">
          <el-input v-model="addFormData.threshold_value" type="number" style="width: 60%" />
        </el-form-item>
        <el-form-item label="持续时长: " required prop="duration">
          <el-input v-model="addFormData.duration" style="width: 60%" />

        </el-form-item>
        <el-form-item label="告警等级: " required prop="severity">
          <el-select v-model="addFormData.severity" placeholder="请选择告警级别">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="概要信息: " required prop="summary">
          <el-input v-model="addFormData.summary" style="width: 60%" />
        </el-form-item>
        <el-form-item label="扩展标签: ">
          <div class="key-value">
            <label for="">键</label>
            <el-input v-model="labelKey" size="small" style="width: 120px" />
            <label for="">值</label>
            <el-input v-model="labelValue" size="small" style="width: 120px" />
            <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag()">添加</el-button>
            <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag()">删除</el-button>
          </div>
          <el-descriptions :column="1" border>
            <template slot="extra" />
            <el-descriptions-item>
              <template slot="label">
                已录入数据
              </template>
              {{ addFormData.extend_labels }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form-item>
        <el-form-item label="描述信息:">
          <el-input v-model="addFormData.description" type="textarea" style="width: 60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormData('addFormData')">重置</el-button>
        <el-button type="primary" @click="methodVisible==='create'?createFormData('addFormData'):updateFormData()">提 交
        </el-button>
        <el-button @click="closeForm('addFormData')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="PromeQl语句测试"
      :visible.sync="PromedialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :before-close="PromehandleClose"
    >
      <el-table
        :data="PromeQueryList"
        border
        :header-cell-style="{background:'#fafafa',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column
          label="metric"
        >
          <template slot-scope="{row}">
            <span>{{ row.metric }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="values"
          width="220"
        >
          <template slot-scope="{row}">
            <pre v-if="row.values " v-html="row.values.join('<br>')" />
            <pre v-if="row.value ">{{ row.value }}</pre>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>

  </div>

</template>

<script>

import { Rules as masterApi } from '@/api/monitoring'
import { Group as groupApi } from '@/api/monitoring'
import { Level as LevelApi } from '@/api/message-center'
import Json2yaml from 'json2yaml'

const defaultgroupAddRowData = {
  group: '',
  name: '',
  promeql: '',
  status: true,
  condition: 0,
  threshold_value: 60,
  duration: 60,
  severity: '',
  summary: '',
  description: '',
  extend_labels: {}
}
export default {
  name: 'Index',
  props: {
    showVisible: {
      type: Boolean,
      default:
        false
    },
    addFormData: {
      type: Object,
      default: JSON.parse(JSON.stringify(defaultgroupAddRowData))
    },
    methodVisible: {
      type: String,
      default: 'create'
    }

  },
  data() {
    return {
      Json2yaml: Json2yaml,
      PromeQueryList: '',
      PromedialogVisible: false,
      groupList: [],
      labelKey: '',
      labelValue: '',
      levelList: [],
      durationSelect: 's',
      conditionChoices: [
        {
          id: 0,
          label: '=='
        },
        {
          id: 1,
          label: '!='
        },
        {
          id: 2,
          label: '>'
        },
        {
          id: 3,
          label: '>='
        },
        {
          id: 4,
          label: '<'
        },
        {
          id: 5,
          label: '<='
        }
      ],
      isVisibleShow: this.showVisible,
      dialogCreateTitle: '新增 app 规则',
      dialogUpdateTitle: '更新 app 规则',
      dialogWidth: '40%',

      // tempData: Object.assign({}, defaultRole),
      // addFormData: JSON.parse(JSON.stringify(defaultRuleaddRowData)),
      addDialogFormVisible: false,
      multipleSelection: [],
      userList: []
    }
  },
  watch: {
    showVisible(newName, oldName) {
      this.isVisibleShow = newName
    }
  },
  created() {
    this.GetLevel()
    this.GetGroup()
  },
  methods: {
    prometheusValue(val) {
      return val.join('<br>')
    },
    PromehandleClose() {
      this.PromeQueryList = ''
      this.PromedialogVisible = false
    },
    executeQuery() {
      if (!this.addFormData.promeql) return false
      const qarams = {
        query: this.addFormData.promeql
      }
      masterApi.execute(qarams).then(res => {
        this.PromeQueryList = res.data
        this.PromedialogVisible = true
      })
    },
    confirmAddEnvvarsTag() {
      if (!this.labelKey || !this.labelValue) {
        this.$message({
          message: '键值都不能为空',
          type: 'warning'
        })
      } else {
        this.addFormData.extend_labels[this.labelKey] = this.labelValue
        this.labelKey = ''
        this.labelValue = ''
      }
    },
    confirmDeleteEnvvarsTag() {
      if (!this.labelKey) {
        this.$message({
          message: '删除键，键的 key 不能为空。',
          type: 'warning'
        })
      } else {
        if (!this.addFormData.extend_labels[this.labelKey]) {
          this.$message({
            message: `指定的键不存在，${this.labelKey}`,
            type: 'warning'
          })
        } else {
          delete this.addFormData.extend_labels[this.labelKey]
          this.labelKey = ''
          this.labelValue = ''
        }
      }
    },
    GetGroup() {
      groupApi.list().then(res => {
        this.groupList = res.data
      })
    },
    GetLevel() {
      LevelApi.list().then(res => {
        this.levelList = res.data
      })
    },
    closeForm(formName) {
      this.drawerFileList = []
      this.isVisibleShow = false
      this.$refs['addFormData'].resetFields()
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    },
    updateFormData() {
      this.$confirm('正在更新, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.patch(this.addFormData.id, this.addFormData).then((request) => {
          this.$notify({
            title: '成功',
            message: '更新成功!',
            type: 'success',
            duration: 2000
          })
          this.closeForm('addFormData')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消创建'
        })
      })
    },
    createFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在新建, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.addFormData).then((request) => {
              this.$notify({
                title: '成功',
                message: '创建成功!',
                type: 'success',
                duration: 2000
              })
              this.closeForm('addFormData')
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消创建'
            })
          })
        } else {
          this.$message.error('提交错误，请按规定进行填写')
          return false
        }
      })
    },
    resetFormData(formName) {
      this.$refs[formName].resetFields()
      this.addFormData = JSON.parse(JSON.stringify(defaultgroupAddRowData))

      // this.$emit('update:isShow', false)
    },
    addData() {
      this.addDialogFormVisible = true
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

::v-deep .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
