<template>
  <div>
    <el-dialog
      :title="methodVisible==='create'?dialogCreateTitle:dialogUpdateTitle"
      :width="dialogWidth"
      :visible.sync="showVisible"
      :close-on-click-modal="false"
      @close="closeForm('addFormData')"
    >
      <el-form ref="addFormData" :model="addFormData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="英文名称" required prop="name">
          <el-input v-model="addFormData.name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="中文名称" required prop="cname">
          <el-input v-model="addFormData.cname" style="width: 60%" />
        </el-form-item>
        <el-form-item label="排序级别" required prop="weight">
          <el-input v-model="addFormData.weight" style="width: 60%" type="number" />
        </el-form-item>
        <el-form-item label="通知媒介" required prop="provider">
          <el-select v-model="addFormData.provider" clearable placeholder="请选择">
            <el-option
              v-for="item in providerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通知用户组" required prop="cname">
          <el-select v-model="addFormData.group" clearable placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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

import { Level as masterApi } from '@/api/message-center'
import { Provider as ProviderAPi } from '@/api/message-center'
import { Group as GroupAPi } from '@/api/message-center'

const defaultaddFormData = {
  name: '',
  cname: '',
  provider: '',
  group: '',
  weight: ''
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
      default: JSON.parse(JSON.stringify(defaultaddFormData))
    },
    methodVisible: {
      type: String,
      default: 'create'
    }

  },
  data() {
    return {
      dialogCreateTitle: '新增通知等级',
      dialogUpdateTitle: '更新通知等级',
      dialogWidth: '40%',

      ruleForm: {},
      drawerFileList: [],
      tmpFile: {},
      // tempData: Object.assign({}, defaultRole),
      // addFormData: JSON.parse(JSON.stringify(defaultaddFormData)),
      addDialogFormVisible: false,
      multipleSelection: [],
      groupList: [],
      providerList: []
    }
  },
  created() {
    this.getGroupList()
    this.getProviderList()
  },
  mounted() {
    // 高亮渲染
  },
  methods: {
    getGroupList() {
      GroupAPi.list().then(res => {
        this.groupList = res.data
      })
    },
    getProviderList() {
      ProviderAPi.list().then(res => {
        this.providerList = res.data
      })
    },
    closeForm(formName) {
      this.drawerFileList = []
      this.$refs['addFormData'].resetFields()
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    },
    updateFormData() {
      this.$confirm('正在更新通知等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.patch(this.addFormData.id, this.addFormData).then((request) => {
          this.$notify({
            title: '成功',
            message: '通知等级更新成功!',
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
          this.$confirm('正在新建通知等级, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.addFormData).then((request) => {
              this.$notify({
                title: '成功',
                message: '通知等级创建成功!',
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
      this.addFormData = JSON.parse(JSON.stringify(defaultaddFormData))

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
</style>
