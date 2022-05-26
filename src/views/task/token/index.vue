<template>
  <el-card class="box-card">
    <div>
      <el-button type="primary" @click="submitCreate">更新 Token</el-button>
    </div>
    <div style="margin-top: 10px">

      <table class="mailTable" cellspacing="0" cellpadding="0">
        <tr>
          <td class="column">token</td>
          <td>{{ data.token }}</td>
        </tr>
        <tr>
          <td class="column">操作用户</td>
          <td>{{ data.src_user }}</td>
        </tr>
        <tr>
          <td class="column">来源IP</td>
          <td>{{ data.src_ip }}</td>
        </tr>
        <tr>
          <td class="column">创建时间</td>
          <td>{{ data.created_at }}</td>
        </tr>
        <tr>
          <td class="column">更新时间</td>
          <td>{{ data.updated_at }}</td>
        </tr>
      </table>
    </div>
  </el-card>
</template>

<script>
import { TaskToken as masterApi } from '@/api/task'

export default {
  name: 'Index',
  data() {
    return {
      size: '',
      data: {}
    }
  },
  created() {
    this.GetList()
  },
  methods: {
    GetList() {
      masterApi.list(this.pageQuerylist).then(response => {
        this.data = response.data
      })
    },
    submitCreate() {
      this.$confirm('此操作将永久重置该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.create().then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更新！'
        })
      })
    }

  }
}

</script>

<style scoped>
.mailTable {
  width: 100%;
  border-top: 1px solid #E6EAEE;
  border-left: 1px solid #E6EAEE;
}

.mailTable tr td {
  width: 200px;
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
  border-bottom: 1px solid #E6EAEE;
  border-right: 1px solid #E6EAEE;
}

.mailTable tr td.column {
  background-color: #EFF3F6;
  color: #393C3E;
  width: 30%;
}

</style>
