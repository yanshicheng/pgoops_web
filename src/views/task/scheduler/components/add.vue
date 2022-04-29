<template>
  <div>
    <el-dialog title="任务调度" :visible.sync="isShow" :close-on-click-modal="false" @close="closeDia('addFormData')">
      <el-form ref="addFormData" :model="addFormData" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任务标题" prop="name">
          <el-input v-model="addFormData.name" />
        </el-form-item>
        <el-form-item label="调度周期">
          <el-row>
            <el-col :span="3"><el-input v-model="addFormData.execution_cycle.second" placeholder="秒，默认 *" style="width: 100%" size="small" />秒</el-col>
            <el-col :span="3"><el-input v-model="addFormData.execution_cycle.minute" placeholder="分，默认 *" style="width: 100%" size="small" />分</el-col>
            <el-col :span="3"><el-input v-model="addFormData.execution_cycle.hour" placeholder="时，默认 *" style="width: 100%" size="small" />时</el-col>
            <el-col :span="3"><el-input v-model="addFormData.execution_cycle.day" placeholder="日，默认 *" style="width: 100%" size="small" />日</el-col>
            <el-col :span="4"><el-input v-model="addFormData.execution_cycle.month" placeholder="月，默认 *" style="width: 100%" size="small" />月</el-col>
            <el-col :span="4"><el-input v-model="addFormData.execution_cycle.day_of_week" placeholder="周，默认 *" style="width: 100%" size="small" />周</el-col>
            <el-col :span="4"><el-input v-model="addFormData.execution_cycle.year" placeholder="年，默认 *" style="width: 100%" size="small" />年</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="执行目标" prop="target">
          <el-input v-model="addFormData.target" />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-radio v-model="addFormData.type" label="1">快速执行</el-radio>
          <el-radio v-model="addFormData.type" label="2">状态管理</el-radio>
        </el-form-item>
        <template v-if="addFormData.type === '1'">
          <el-form-item label="执行模块" prop="module">
            <el-select v-model="addFormData.module" clearable :clear="moduleClearSelect" placeholder="选择模块">
              <el-option
                v-for="(value,key,index) in moduleoptions"
                :key="index"
                :label="key"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模块方法" prop="method">
            <el-select v-model="addFormData.method" clearable placeholder="选择方法">
              <el-option
                v-for="(value,index) in moduleoptions[addFormData.module]"
                :key="index"
                :label="value"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="参数指令">
            <el-input v-model="addFormData.arg" />
          </el-form-item>
        </template>
        <el-form-item label="备注">
          <el-input v-model="addFormData.remark" type="textarea" />
        </el-form-item>
        <el-form-item />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addFormData')">重置</el-button>
        <el-button type="primary" @click="submitForm('addFormData')">提 交</el-button>
        <el-button @click="closeDia('addFormData')">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { TaskScheduler as masterApi } from '@/api/task'

const defaultaddFormData = {
  name: '',
  type: '1',
  execution_cycle: {
    year: '*',
    month: '*',
    day_of_week: '*',
    day: '*',
    hour: '*',
    minute: '*',
    second: '30'
  },
  target: '',
  method: '',
  module: '',
  args: '',
  remark: ''
}
export default {
  name: 'Index',
  props: {
    isShow: {
      type: Boolean,
      default:
        false
    }
  },
  data() {
    return {

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
      addFormData: JSON.parse(JSON.stringify(defaultaddFormData)),
      addDialogFormVisible: false,
      multipleSelection: []
    }
  },
  created() {

  },
  methods: {
    closeDia(formName) {
      this.$refs[formName].resetFields()
      this.addFormData = JSON.parse(JSON.stringify(defaultaddFormData))
      this.$emit('update:isShow', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在提交调度任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.addFormData).then(() => {
              this.resetForm('addFormData')
              this.$message({
                type: 'success',
                message: '调度任务已提交!'
              })
            })
          })
        } else {
          this.$message.error('提交错误，请按规定进行填写')
          return false
        }
      })
    },
    resetForm(formName) {
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

</style>
