<template>
  <div class="container">
    <el-button size="small" type="primary" style="margin-bottom:10px;float: right;" plain @click="setRelation">绑定
    </el-button>
    <el-table :data="tableData" border style="width: 100%" max-height="400">
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="parent_name" label="分类名" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="alias" label="别名" />
      <el-table-column prop="record_log" label="日志记录">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.record_log" disabled size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="ban_bind" label="禁止关联">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.ban_bind" disabled size="mini" />
        </template>
      </el-table-column>
      <!--      <el-table-column prop="ban_bind" label="关联模式">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-switch v-model="scope.row.ban_mode" disabled size="mini" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="cancelData(scope.row, scope.$index, tableData)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="绑定"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="80%"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom:10px;">
        <el-select v-model="keyword" placeholder="请选择" size="small">
          <el-option
            v-for="item in selectLists"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button plain type="primary" size="small" style="margin-left: 10px;" @click="searchData">查询</el-button>
      </div>
      <el-table :data="innerTableData" border style="width: 100%" max-height="400">
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="alias" label="别名" />
        <el-table-column prop="record_log" label="日志记录">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.record_log" disabled size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="禁止关联｜关联模式｜操作" width="220" align="center">
          <template slot-scope="scope">
            <el-switch v-model="ban_bind" size="mini" />
            <el-switch v-model="bind_mode" style="margin:0 10px;" size="mini" />
            <el-button type="primary" plain size="small" @click="editRelation(scope.row)">绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Classify as masterApi } from '@/api/data-map'

export default {
  name: '',
  props: {
    editData: {
      type: Array,
      default: () => []
    },
    pid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      tableData: [],
      innerTableData: [],
      dialogVisible: false,
      selectLists: [],
      keyword: '',
      ban_bind: true,
      bind_mode: true
    }
  },
  watch: {
    editData(newVal) {
      this.tableData = newVal
    }
  },
  created() {
    this.tableData = this.editData
  },
  methods: {
    // 解绑
    cancelData(row, index, tableData) {
      const params = {
        parent_classify_id: this.pid,
        child_classify_id: row.id
      }
      masterApi.un_bind(params).then(res => {
        if (res.code === 0) {
          this.$message.success('解绑成功')
          tableData.splice(index, 1)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    setRelation() {
      this.dialogVisible = true
      this.getSelectList()
    },
    // 提交
    confirmSubmit() {

    },
    getSelectList() {
      masterApi.parent().then(res => {
        this.selectLists = res.data
      })
    },
    getTypeList(pid) {
      let params = {}
      if (pid) {
        params = {
          pid: pid,
          ban_bind: false
        }
      }
      masterApi.list(params).then(res => {
        if (res.code === 0) {
          this.innerTableData = res.data.result ? res.data.result : res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    searchData() {
      this.getTypeList(this.keyword)
    },
    editRelation(row) {
      const params = {
        parent_classify_id: this.pid,
        child_classify_id: row.id,
        bind_mode: this.bind_mode,
        ban_bind: this.ban_bind
      }
      masterApi.bind(params).then(res => {
        if (res.code === 0) {
          this.$message.success('绑定成功')
          this.dialogVisible = false
          this.keyword = ''
          this.innerTableData = []
          this.$emit('refresh')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
