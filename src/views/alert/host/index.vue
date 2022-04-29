<template>
  <div>
    <el-card class="box-card">
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="pageQuerylist.search"
            clearable
            placeholder="请输入搜索内容"
            class="input-with-select"
            style="width: 200px"
          />
          <el-button style="margin-left: 10px" class="el-button  el-button--primary" icon="el-icon-search" @click="searchData">
            搜索
          </el-button>
          <el-button
            icon="el-icon-edit"
            class="el-button  el-button--primary"
            type="primary"
            @click="addData"
          >
            新建
          </el-button>
        </div>
        <el-table
          :data="alertHostDataList"
          border
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          />
          <el-table-column
            prop="hostname"
            label="主机名"
            align="center"
          />
          <el-table-column
            prop="address"
            label="主机地址"
            align="center"
          />
          <el-table-column
            prop="port"
            label="主机端口"
            align="center"
          />
          <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="180">
            <template slot-scope="{row}">
              <template>
                <el-button v-if="row.status === 1" size="mini" type="warning" @click="forbiddenButton(row)">禁用</el-button>
                <el-button v-else size="mini" type="info" @click="resumeButton(row)">启用</el-button>
              </template>
              <el-button size="mini" type="danger" @click="deleteButton(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="pageQuerylist.total>0"
          background
          :total="pageQuerylist.total"
          :current-page="pageQuerylist.page"
          :page-sizes="pageQuerylist.sizes"
          :page-size="pageQuerylist.limit"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <AddTableData
        :is-show.sync="addDialogFormVisible"
        @isShow="IsShow"
      />
    </el-card>
  </div>
</template>

<script>
import { AlertHost as masterApi } from '@/api/alert'
import AddTableData from '@/views/alert/host/components/add'

export default {

  name: 'Index',
  components: {
    AddTableData
  },
  data() {
    return {
      addDialogFormVisible: false,
      alertHostDataList: [],
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      run_mode: [{ id: 1, name: '页面执行' }, { id: 2, name: '定时任务' }],
      task_type: [{ id: 1, name: '快速执行' }, { id: 2, name: '状态管理' }],
      searchInfo: {
        run_mode: '',
        task_type: '',
        method: ''
      },
      multipleSelection: []
    }
  },
  created() {
    this.GetList()
  },
  methods: {
    deleteButton(row) {
      this.$confirm('正在删除Alert主机, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    resumeButton(row) {
      this.$confirm('此操作将恢复禁用主机,将进行告警存储及发送, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.resume(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '恢复主机成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消恢复！'
        })
      })
    },
    forbiddenButton(row) {
      this.$confirm('此操作将禁用主机,将不进行告警存储及发送, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.forbidden(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '禁用主机成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除！'
        })
      })
    },
    IsShow(b) {
      this.addDialogFormVisible = false
      this.GetList()
    },
    addData() {
      this.addDialogFormVisible = false
      this.addDialogFormVisible = true
    },
    infoFormVisible(row) {
      this.$router.push({ name: 'TashHistoryDetail', query: { id: row.id }})
    },
    onSubmit() {
    },
    GetList() {
      masterApi.list({
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.alertHostDataList = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    onReset() {
      this.searchInfo = {}
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (var key in val) {
        this.multipleSelection.push(Number(val[key]['id']))
      }
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.searchData()
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.searchData()
    },
    searchData() {
      const params = {
        search: this.pageQuerylist.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.alertHostDataList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    }
  }
}
</script>

<style scoped>

</style>
