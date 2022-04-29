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
        <el-form-item label="应用名称" required prop="app_name">
          <el-input v-model="addFormData.app_name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="通告主题" required prop="name">
          <el-input v-model="addFormData.name" style="width: 60%" />
        </el-form-item>
        <el-form-item label="通知用户" required prop="is_all">
          <el-switch
            v-model="addFormData.is_at"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="@all" required prop="is_all">
          <el-switch
            v-model="addFormData.is_all"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="通告类型" required prop="type">
          <el-select v-model="addFormData.type" clearable placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通告级别" required prop="level">
          <el-select v-model="addFormData.level" clearable placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.cname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实例地址" required prop="instance">
          <el-input v-model="addFormData.instance" style="width: 60%" />
        </el-form-item>
        <el-form-item label="概要信息" required prop="summary">
          <el-input v-model="addFormData.summary" style="width: 60%" />
        </el-form-item>
        <el-form-item label="开始时间" required prop="start_at">
          <el-date-picker
            v-model="addFormData.start_at"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="结束时间" required prop="end_at">
          <el-date-picker
            v-model="addFormData.end_at"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="持续时间" required prop="duration">
          <el-input v-model="addFormData.duration" style="width: 60%" />
        </el-form-item>

        <el-form-item label="通知用户">
          <el-select v-model="addFormData.user" clearable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="扩展标签">
          <el-input v-model="addFormData.labels" type="textarea" />
        </el-form-item>
        <el-form-item label="详细信息">
          <el-input v-model="addFormData.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormData('addFormData')">重置</el-button>
        <el-button type="primary" @click="createFormData('addFormData')">提 交
        </el-button>
        <el-button @click="closeForm('addFormData')">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

import { History as masterApi } from '@/api/message-center'
import { Level as LevelApi } from '@/api/message-center'
import { UserInfoO as UserAPi } from '@/api/user'

const defaultaddFormData = {
  app_name: '',
  name: '',
  type: '',
  level: '',
  instance: '',
  labels: '',
  summary: '',
  description: '',
  start_at: '',
  end_at: '',
  duration: '',
  user: '',
  is_all: false
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
      dialogCreateTitle: '新增通知',
      dialogUpdateTitle: '更新项目',
      dialogWidth: '40%',

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
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      types: [
        {
          id: 0,
          name: '告  警'
        },
        {
          id: 1,
          name: '告警恢复'
        },
        {
          id: 2,
          name: '通  知'
        }
      ],
      levelList: [],
      userList: []
    }
  },
  created() {
    this.getLevelList()
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
    getLevelList() {
      LevelApi.list().then(res => {
        this.levelList = res.data
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
      this.drawerFileList = []
      this.$refs['addFormData'].resetFields()
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    },
    updateFormData() {
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
    },
    createFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在新建通知, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '通知下发中请等候....',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            masterApi.create(this.addFormData).then((request) => {
              loading.close()
              this.$notify({
                title: '成功',
                message: '通知下发成功，请检查!',
                type: 'success',
                duration: 5000
              })
              this.closeForm('addFormData')
            }).catch(() => {
              loading.close()
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
