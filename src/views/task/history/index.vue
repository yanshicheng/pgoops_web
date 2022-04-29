<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div>
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="执行方法">
            <el-select v-model="searchInfo.run_mode" clearable placeholder="请选择">
              <el-option
                v-for="item in run_mode"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="searchInfo.task_type" clearable placeholder="请选择">
              <el-option
                v-for="item in task_type"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模糊搜索">
            <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容" />
          </el-form-item>

          <el-form-item style="float:right ">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px" shadow="hover">
      <div style="margin-bottom: 20px">
        <el-button @click="toggleSelection()">清空选择</el-button>
        <el-button type="danger" @click="onDelete">删除选择</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="historyList"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          prop="title"
          label="任务标题"
          width="120"
        />
        <el-table-column
          prop="run_mode"
          label="执行方法"
          width="120"
        />
        <el-table-column
          prop="task_type"
          label="任务类型"
          width="120"
        />
        <el-table-column
          prop="module"
          label="执行模块"
          width="120"
        />
        <el-table-column
          prop="method"
          label="模块方法"
          width="120"
        />
        <el-table-column
          prop="args"
          label="任务参数"
          show-overflow-tooltip
        />
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="180">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="detailButton(row)">
              详情
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
    </el-card>

  </div>

</template>

<script>
import { TaskHistory as masterApi } from '@/api/task'

export default {
  name: 'Index',
  data() {
    return {
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      historyList: [],
      methodOptions: { 'ddd': 'aa' },
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
    detailButton(row) {
      this.$router.push({ name: 'TashHistoryDetail', query: { id: row.id }})
    },
    onSubmit() {
    },
    onDelete() {
      const params = { list_id: this.multipleSelection }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delpost(params).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除！'
        })
      })
    },
    GetList() {
      masterApi.list({
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.historyList = response.data.result
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
        search: this.searchInfo.search,
        run_mode: this.searchInfo.run_mode,
        task_type: this.searchInfo.task_type,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.historyList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    }
  }
}
</script>

<style scoped>

</style>
