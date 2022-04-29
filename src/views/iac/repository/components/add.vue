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
        <el-form-item label="项目名" required prop="project_name">
          <el-input v-model="addFormData.project_name" style="width: 60%" />
        </el-form-item>
        <el-form-item />
        <el-form-item label="项目压缩包">
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
            <div slot="tip" class="el-upload__tip" style="color: red"> ***只能上传tar/tar.gz/tar.xz/zip文件</div>
          </el-upload>
          <!--          <div class="file-list">-->
          <!--                        <span v-for="(item, index) in drawerFileList" :key="index">-->
          <!--                            <el-link class="file-link" :underline="false" icon="el-icon-link" type="primary"-->
          <!--                                     :href="item.url" target="_blank">{{ item.name }}</el-link>-->
          <!--&lt;!&ndash;                            <i @click="delete_drawerFileList(index)" class="el-icon-delete el-icon&#45;&#45;right"></i>&ndash;&gt;-->
          <!--                        </span>-->
          <!--          </div>-->
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addFormData.describe" type="textarea" />
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
