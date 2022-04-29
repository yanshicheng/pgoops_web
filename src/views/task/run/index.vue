<template>
  <el-card class="box-card">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="任务标题" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="执行目标" prop="target">
        <el-input v-model="ruleForm.target" />
      </el-form-item>
      <el-form-item label="执行模块" prop="module">
        <el-select v-model="ruleForm.module" clearable :clear="moduleClearSelect" placeholder="选择模块">
          <el-option
            v-for="(value,key,index) in moduleoptions"
            :key="index"
            :label="key"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模块方法" prop="method">
        <el-select v-model="ruleForm.method" clearable :clear="methodClearSelect" placeholder="选择方法">
          <el-option
            v-for="(value,index) in moduleoptions[ruleForm.module]"
            :key="index"
            :label="value"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数指令">
        <el-input v-model="ruleForm.arg" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="ruleForm.remark" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">异步提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import { TaskRun as masterApi } from '@/api/task'

export default {
  name: 'INDEX',
  data() {
    return {
      moduleoptions: {
        'cmd': ['run', 'script', 'shell'],
        'test': ['ping'],
        'archive': ['zip', 'unzip', 'tar', 'gzip', 'gunzip']
      },
      ruleForm: {
        title: '',
        target: '',
        module: '',
        method: '',
        arg: '',
        remark: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 24, message: '长度在 3 到 24 个字符', trigger: 'blur' }
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

      }
    }
  },
  methods: {
    methodClearSelect() {

    },
    moduleClearSelect() {
      this.ruleForm.module = ''
      this.ruleForm.method = ''
    },
    clearSelect() {
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在异步提交任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.ruleForm).then(() => {
              this.resetForm('ruleForm')
              this.$message({
                type: 'success',
                message: '异步执行已提交!'
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
      this.ruleForm.arg = ''
    }
  }
}
</script>

<style scoped>

</style>
