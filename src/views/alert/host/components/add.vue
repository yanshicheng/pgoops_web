<template>
  <div>
    <el-dialog title="新增 Alert 主机" :visible.sync="isShow" :close-on-click-modal="false" @close="closeDia('addFormData')">
      <el-form ref="addFormData" :model="addFormData" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="主机名" prop="hostname">
          <el-input v-model="addFormData.hostname" />
        </el-form-item>
        <el-form-item label="主机地址" prop="address">
          <el-input v-model="addFormData.address" />
        </el-form-item>
        <el-form-item label="主机端口" prop="port">
          <el-input v-model="addFormData.port" type="number" />
        </el-form-item>
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
import { AlertHost as masterApi } from '@/api/alert'

const defaultaddFormData = {
  hostname: '',
  address: '',
  port: '',
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
        hostname: [
          { required: true, message: '主机地址不能为空', trigger: 'blur' },
          { min: 2, max: 24, message: '长度在 2 到 24 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '主机IP不能为空', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '端口不能为空', trigger: 'change' }
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
      this.$emit('isShow', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在创建Alert主机, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.addFormData).then(() => {
              this.resetForm('addFormData')
              this.$message({
                type: 'success',
                message: '创建成功!'
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

      this.$emit('isShow', false)
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
