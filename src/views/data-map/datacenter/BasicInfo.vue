<template>
  <el-form ref="form" :model="form" label-width="80px" style="width: 500px;margin: auto;">
    <el-form-item label="名称" prop="name" required>
      <el-input v-model="form.name" size="small" />
    </el-form-item>
    <el-form-item label="别名" prop="alias" required>
      <el-input v-model="form.alias" size="small" />
    </el-form-item>
    <el-form-item label="图标" prop="icon" required>
      <input id="file" type="file" name="file" @change="getFile($event)">
    </el-form-item>
    <el-form-item label="日志记录" prop="record_log" required>
      <el-switch v-model="form.record_log" size="small" />
    </el-form-item>
    <el-form-item label="禁止关联" prop="ban_bind" required>
      <el-switch v-model="form.ban_bind" size="small" />
    </el-form-item>
    <el-form-item label="选择分类" prop="pid" required>
      <el-select v-model="form.pid" placeholder="请选择" size="small">
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea" size="small" />
    </el-form-item>
    <el-form-item>
      <!-- <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button> -->
      <el-button size="small" @click="closeDia">取 消</el-button>
      <el-button size="small" type="primary" @click="confirmSubmit">提 交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { Classify as masterApi } from '@/api/data-map'

export default {
  name: '',
  props: {
    editData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    pid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      typeList: [],
      form: {
        name: '',
        alias: '',
        icon: null,
        record_log: false,
        ban_bind: false,
        pid: '',
        remark: ''
      }
    }
  },
  watch: {
    editData(newVal) {
      if (newVal) {
        for (const i in this.form) {
          this.form[i] = newVal[i]
        }
      }
    }
  },
  created() {
    this.getTypeList()
    for (const i in this.form) {
      this.form[i] = this.editData[i]
    }
  },
  methods: {
    closeDia() {
      this.$emit('close')
    },
    getFile(event) {
      this.form.icon = event.target.files[0]
    },
    getTypeList() {
      masterApi.parent().then(res => {
        this.typeList = res.data
      })
    },
    confirmSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          for (const key in this.form) {
            formData.append(key, this.form[key])
          }
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          masterApi.update(this.pid, formData, config).then(res => {
            if (res.code === 0) {
              this.$message.success('编辑成功')
              this.closeDia()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCheckedNodes(nodes) {
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-top: 10px !important;
}
</style>
