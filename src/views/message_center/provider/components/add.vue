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
        <el-form-item label="媒介名" required prop="name">
          <el-input v-model="addFormData.name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            class="upload-demo"
            drag
            :on-remove="handleRemove"
            :http-request="uploadFileDrawer"
            :on-change="handleChange"
            :file-list="drawerFileList"
            :before-upload="beforeAvatarUpload"
            action=""
            :show-file-list="true"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip" style="color: red"> ***只能上传png/jpg/icon/svg/格式图标/并且不可超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item />
        <el-form-item label="媒介类" required prop="provider_class">
          <el-input v-model="addFormData.provider_class" style="width: 60%" />
        </el-form-item>
        <el-form-item />
        <el-form-item label="媒介方法" required prop="method">
          <el-select v-model="addFormData.method" clearable placeholder="请选择">
            <el-option
              v-for="item in method_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item />
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

import { Provider as masterApi } from '@/api/message-center'

const defaultaddFormData = {
  project_name: '',
  describe: ''
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
      dialogCreateTitle: '新增项目',
      dialogUpdateTitle: '更新项目',
      dialogWidth: '50%',

      ruleForm: {},
      drawerFileList: [],
      // tempData: Object.assign({}, defaultRole),
      // addFormData: JSON.parse(JSON.stringify(defaultaddFormData)),
      addDialogFormVisible: false,
      multipleSelection: [],
      method_list: [
        {
          value: 0,
          label: 'send_text_msg'
        },
        {
          value: 1,
          label: 'send_markdown_msg'
        },
        {
          value: 2,
          label: 'send_html_msg'
        },
        {
          value: 3,
          label: 'send_file_msg'
        },
        {
          value: 4,
          label: 'send_link_msg'
        },
        {
          value: 5,
          label: 'send_image_msg'
        }
      ]
    }
  },
  created() {
  },
  mounted() {
    // 高亮渲染
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJpeg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isIcon = file.type === 'vnd.microsoft.icon'
      const isSvg = file.type === 'image/svg+xml'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图标大小不能超过 2MB!')
      }
      if (isJpeg || isPng || isIcon || isSvg) {
        return true
      } else {
        this.$message.error('上传的项目文件只能是 png| jpeg |icon|格式!')
        return false
      }
    },
    handleRemove(file, fileList) {
      this.ruleForm = {}
      this.drawerFileList = []
      this.tmpFile = {}
    },
    handleChange(file, fileList) {
      if (fileList.length !== 1) {
        fileList.splice(0, 1)
      }
      this.addFormData.icon = file.raw
      this.drawerFileList = fileList
    },
    uploadFileDrawer(params) {
      this.tmpFile = { 'icon': params.file }
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
        const formData = new FormData()
        if (this.addFormData.icon) {
          formData.append('icon', this.addFormData.icon)
        }
        formData.append('provider_class', this.addFormData.provider_class)
        formData.append('method', this.addFormData.method)
        formData.append('name', this.addFormData.name)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        masterApi.patch(this.addFormData.id, formData, config).then((request) => {
          this.$notify({
            title: '成功',
            message: '媒介更新成功!',
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
          this.$confirm('正在新建新媒介, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const formData = new FormData()
            formData.append('icon', this.addFormData.icon)
            formData.append('provider_class', this.addFormData.provider_class)
            formData.append('method', this.addFormData.method)
            formData.append('name', this.addFormData.name)
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            masterApi.create(formData, config).then((request) => {
              this.$notify({
                title: '成功',
                message: '媒介创建成功!',
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
