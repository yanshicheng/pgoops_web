<template>
  <el-dialog
    title="新增表"
    :visible="isShow"
    width="600px"
    :close-on-click-modal="false"
    @close="closeDia"
  >
    <el-form ref="form" :model="form" label-width="80px">
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
      <el-form-item v-if="showSelect" label="选择分类" prop="pid" required>
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDia">取 消</el-button>
      <el-button size="small" type="primary" @click="confirmSubmit">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Classify as masterApi } from '@/api/data-map'

export default {
  name: '',
  props: {
    isShow: {
      type: Boolean,
      default: false
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
      },
      showSelect: true
    }
  },
  watch: {
    isShow(newVal) {
      if (newVal && this.pid) {
        this.showSelect = false
        this.form.pid = this.pid
      }
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    closeDia() {
      this.$refs['form'].resetFields()
      this.$emit('update:isShow', false)
    },
    getFile(event) {
      this.form.icon = event.target.files[0]
    },
    getTypeList() {
      masterApi.parent().then(res => {
        if (res.code === 0) {
          this.typeList = res.data.result ? res.data.result : res.data
        } else {
          this.$message.error(res.message)
        }
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
          masterApi.create(formData, config).then(res => {
            if (res.code === 0) {
              this.$message.success('新增表成功')
              this.closeDia()
              this.$parent.fetchTableClassifyTree()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 18px;
}

::v-deep .el-dialog {
  margin-top: 10px !important;
}
</style>
