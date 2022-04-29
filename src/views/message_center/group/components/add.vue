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
        <el-form-item label="组  名" required prop="name">
          <el-input v-model="addFormData.name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="绑定用户">
          <el-transfer
            v-model="addFormData.user"
            filterable
            filter-placeholder="请输入搜索用户名"
            :data="userList"
            :button-texts="['移除', '增加']"
            :titles="['候选用户', '选中用户']"
            :props="{key: 'id',label: 'name',disabled:'disabled'}"
          />
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

import { Group as masterApi } from '@/api/message-center'
import { UserInfoO as UserAPi } from '@/api/user'

const defaultaddFormData = {
  name: '',
  user: []
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
      dialogCreateTitle: '新增通知组',
      dialogUpdateTitle: '更新通知组',
      dialogWidth: '50%',

      // tempData: Object.assign({}, defaultRole),
      // addFormData: JSON.parse(JSON.stringify(defaultaddFormData)),
      addDialogFormVisible: false,
      multipleSelection: [],
      userList: []
    }
  },
  created() {
    this.getUserList()
  },
  mounted() {
    // 高亮渲染
  },
  methods: {
    getUserList() {
      UserAPi.list().then(res => {
        this.userList = res.data
      })
    },
    beforeAvatarUpload(file) {
      const isTar = file.type === 'application/x-tar'
      const isXz = file.type === 'application/x-xz'
      const isGzip = file.type === 'application/x-gzip'
      const isZip = file.type === 'application/zip'
      if (isTar || isXz || isGzip || isZip) {
        return true
      } else {
        this.$message.error('上传的项目文件只能是 zip| tar | tar.gz | tar.xz 格式!')
        return false
      }
    },
    closeForm(formName) {
      this.drawerFileList = []
      this.$refs['addFormData'].resetFields()
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    },
    updateFormData() {
      this.$confirm('正在更新通知组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.patch(this.addFormData.id, this.addFormData).then((request) => {
          this.$notify({
            title: '成功',
            message: '通知组更新成功!',
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
          this.$confirm('正在新建通知组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.addFormData).then((request) => {
              this.$notify({
                title: '成功',
                message: '通知组创建成功!',
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
