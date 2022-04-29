<template>
  <el-dialog
    :title="methodVisible==='create'?dialogCreateTitle:dialogUpdateTitle"
    :width="dialogWidth"
    :visible.sync="showVisible"
    :append-to-body="false"
    :close-on-click-modal="false"
    top="2vh"
    @close="closeDia('addFormData')"
  >

    <div style="height: 550px; overflow: auto">
      <el-form ref="addFormData" :model="addFormData" label-width="100px">
        <el-form-item label="任务名" prop="name" required>
          <el-input v-model="addFormData.name" />
        </el-form-item>
        <el-form-item label="项目" prop="repository" required>
          <el-select v-model="addFormData.repository" filterable placeholder="请选择">
            <el-option
              v-for="item in dataList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主机列表">
          <el-input v-model="addFormData.inventories" placeholder="多个IP或域名请使用空格隔开" />
        </el-form-item>
        <el-form-item label="变量">
          <el-input v-model="addFormData.envvars" placeholder="示例代码: {'key': 'val'}" />
        </el-form-item>
        <el-form-item label="环境变量">
          <el-input v-model="addFormData.extravars" placeholder="示例代码: {'key': 'val'}" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="addFormData.role" placeholder="多个角色请使用空格隔开" />
        </el-form-item>
        <el-form-item label="执行标签">
          <el-input v-model="addFormData.tags" placeholder="多个标签请使用空格隔开" />
        </el-form-item>
        <el-form-item label="跳过标签">
          <el-input v-model="addFormData.skip_tags" placeholder="多个标签请使用空格隔开" />
        </el-form-item>
        <el-form-item label="并发数" prop="forks" required>
          <el-input v-model="addFormData.forks" type="number" />
        </el-form-item>
        <el-form-item label="超时时间(s)" prop="timeout" required>
          <el-input v-model="addFormData.timeout" type="number" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addFormData.describe" type="textarea" />
        </el-form-item>
        <el-form-item />
      </el-form>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="diskRunFormFunc('addFormData')">前台运行</el-button>
      <el-button type="primary" @click="syncRunFormFunc('addFormData')">异步运行
      </el-button>
      <el-button @click="closeDia('addFormData')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Task as masterApi } from '@/api/iac'
import { REPOSITORY as repositoryApi } from '@/api/iac'

const defaultaddFormData = {
  name: '',
  repository: '',
  inventories: '',
  envvars: Array,
  extravars: Array,
  forks: 1,
  timeout: 3600,
  role: '',
  tags: '',
  skip_tags: '',
  describe: ''
}
export default {
  name: 'Run',
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
      dataList: [],
      ruleForm: {},
      drawerFileList: [],
      tmpFile: {},
      title: '创建任务',
      updateTitle: '重复执行',
      width: '50%'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    serializersData() {
      this.addFormData.role = this.addFormData.role.toString()
      this.addFormData.role = this.addFormData.role.toString()
    },
    diskRunFormFunc(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.$confirm('正在新建项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.serializersData()
            masterApi.create(this.addFormData).then(response => {
              var ws = new WebSocket(`ws://127.0.0.1:8000/ws/iac/task/${response.data.id}/`)
              // ws.onopen = function () {
              //   // Web Socket 已连接上，使用 send() 方法发送数据
              //   ws.send("发送数据")
              //   alert("数据发送中...")
              // }
              //
              ws.onmessage = function(evt) {
                alert('数据已接收...')
              }
            //   // this.closeDia()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消！'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    syncRunFormFunc(addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          this.$confirm('正在异步创建项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.serializersData()
            masterApi.create_rsync(this.addFormData).then(response => {
              this.$notify({
                title: '成功',
                message: '异步提交任务成功!',
                type: 'success',
                duration: 2000
              })
              this.closeDia()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消！'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getList() {
      repositoryApi.list({}).then(response => {
        this.dataList = response.data
      })
    },
    closeDia(formName) {
      // this.$refs[formName].resetFields()
      // this.addFormData = JSON.parse(JSON.stringify(defaultaddFormData))
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    }
  }
}
</script>

<style scoped>

.el-form-item {
  margin-bottom: 20px;
}

</style>
