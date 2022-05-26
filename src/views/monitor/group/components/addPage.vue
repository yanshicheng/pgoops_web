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
        <el-form-item label="scheme : " required prop="scheme">
          <el-select v-model="addFormData.scheme" placeholder="请选择">
            <el-option
              v-for="item in conditionChoices"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="metrics path: " required prop="metrics_path">
          <el-input v-model="addFormData.metrics_path" style="width: 60%" />
        </el-form-item>
        <el-form-item label="grafana path: " required prop="grafana_path">
          <el-input v-model="addFormData.grafana_path" style="width: 60%" />
        </el-form-item>
        <el-form-item label="consul tag: " required prop="consul_tag">
          <el-input v-model="addFormData.consul_tag" style="width: 60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormData('addFormData')">重置</el-button>
        <el-button type="primary" @click="methodVisible==='create'?createFormData('addFormData'):updateFormData()">提 交
        </el-button>
        <el-button @click="closeForm('addFormData')">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

import { Group as masterApi } from '@/api/monitoring'

const defaultgroupAddRowData = {
  name: '',
  scheme: 0,
  metrics_path: '/metrics',
  consul_tag: '',
  grafana_path: ''
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
      labelKey: '',
      labelValue: '',
      levelList: [],
      durationSelect: 's',
      conditionChoices: [
        {
          id: 0,
          label: 'http'
        },
        {
          id: 1,
          label: 'https'
        }
      ],
      isVisibleShow: this.showVisible,
      dialogCreateTitle: '新增 app 组',
      dialogUpdateTitle: '更新 app 组',
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
  },
  methods: {
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
