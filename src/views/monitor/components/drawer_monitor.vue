<template>

  <el-drawer
    :wrapper-closable="false"
    :title="monitorTitle"
    :visible.sync="showVisible"
    direction="rtl"
    :size="widhtDrawer()"
    :close-on-press-escape="false"
    :before-close="handleClose"
  >
    <div v-if="showVisible" id="omp_iframe_container" :style="divIframeStyle">
      <iframe id="omp_iframe" ref="iframe" :src="monitorUrl" width="100%" :style="iframeStyle()" frameBorder="0" />
    </div>
  </el-drawer>

</template>

<script>

import { REPOSITORY as masterApi } from '@/api/iac'

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
    monitorUrl: {
      type: String,
      default: ''
    },
    monitorTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogCreateTitle: '新增项目',
      dialogUpdateTitle: '更新项目',
      dialogWidth: '50%',

      ruleForm: {},
      drawerFileList: [],
      tmpFile: {},
      title: '新增项目',
      rules: {
        name: [
          { required: true, message: '任务标题', trigger: 'blur' },
          { min: 2, max: 24, message: '长度在 2 到 24 个字符', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '请输入执行目标', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        module: [
          { required: true, message: '请选择执行模块', trigger: 'change' }
        ],
        method: [
          { required: true, message: '请选择模块方法', trigger: 'change' }
        ]

      },
      moduleoptions: {
        'cmd': ['run', 'script', 'shell'],
        'test': ['ping'],
        'archive': ['zip', 'unzip', 'tar', 'gzip', 'gunzip']
      },
      // tempData: Object.assign({}, defaultRole),
      // addFormData: JSON.parse(JSON.stringify(defaultaddFormData)),
      addDialogFormVisible: false,
      multipleSelection: []
    }
  },
  created() {
  },
  mounted() {
    // 高亮渲染
  },
  methods: {
    widhtDrawer() {
      const h = document.getElementById('root')
      return `${h.clientWidth + 50}px`
    },
    divIframeStyle() {
      const h = document.documentElement.clientHeight
      return `overflow: hidden; position: relative; background-color: #f6f7f9;height:${h}px`
    },
    iframeStyle() {
      const h = document.documentElement.clientHeight
      return `width: 100%;position: "absolute";height:${h}px`
    },
    handleClose(done) {
      this.$emit('update:showVisible', false)
      done()
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
    handleRemove(file, fileList) {
      this.ruleForm = {}
      this.drawerFileList = []
      this.tmpFile = {}
    },
    handleChange(file, fileList) {
      if (fileList.length !== 1) {
        fileList.splice(0, 1)
      }
      this.addFormData.code_package = file.raw
      this.drawerFileList = fileList
    },
    uploadFileDrawer(params) {
      this.tmpFile = { 'code_package': params.file }
    },
    closeForm(formName) {
      this.addFormData = JSON.parse(JSON.stringify(defaultaddFormData))
      this.drawerFileList = []
      this.$refs['addFormData'].resetFields()
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    },
    updateFormData() {
      this.$confirm('正在仓库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('code_package', this.addFormData.code_package)
        formData.append('describe', this.addFormData.describe)
        formData.append('project_name', this.addFormData.project_name)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        masterApi.patch(this.addFormData.id, formData, config).then((request) => {
          this.$notify({
            title: '成功',
            message: '项目更新成功!',
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
          this.$confirm('正在新建项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const formData = new FormData()
            formData.append('code_package', this.addFormData.code_package)
            formData.append('describe', this.addFormData.describe)
            formData.append('project_name', this.addFormData.project_name)
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            masterApi.create(formData, config).then((request) => {
              this.$notify({
                title: '成功',
                message: '项目创建成功!',
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

      // this.$emit('update:isShow', false)
    },
    moduleClearSelect() {
      this.addFormData.module = ''
      this.addFormData.method = ''
      this.addFormData.remark = ''
    },
    addData() {
      this.addDialogFormVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (var key in val) {
        this.multipleSelection.push(Number(val[key]['id']))
      }
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
::v-deep .el-drawer__close-btn {
  position: fixed;
  border: none;
  margin-right: 12px;
  cursor: pointer;
  font-size: 20px;
  color: inherit;
  background-color: transparent;
}
::v-deep .el-drawer__header > :first-child {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin-left: 35px;
}
::v-deep  .el-drawer__header {
  display: flex;
  align-items: center;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 22px;
  line-height: 22px;
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
