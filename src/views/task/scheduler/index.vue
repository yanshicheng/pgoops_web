<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div>
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="任务类型">
            <el-select v-model="searchInfo.type" clearable placeholder="请选择">
              <el-option
                v-for="item in task_type"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态">
            <el-select v-model="searchInfo.status" clearable placeholder="请选择">
              <el-option
                v-for="item in task_status"
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
        <el-button @click="addData()">新增</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="schedulerList"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55"-->
        <!--        />-->
        <el-table-column
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          prop="name"
          label="任务标题"
          width="180"
        />
        <el-table-column
          prop="task_id"
          label="任务ID"
          width="280"
        />
        <el-table-column
          prop="next_run_time"
          label="下次调度时间"
          width="180"
        >
          <template slot-scope="{row}">
            <span v-if="row.next_run_time === null">Null</span>
            <span v-else>{{ row.next_run_time | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="任务类型"
          width="120"
        />
        <el-table-column
          prop="target"
          label="目标主机"
          width="120"
        />
        <el-table-column
          prop="module"
          label="模块"
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
        />
        <el-table-column
          prop="user"
          label="创建用户"
        />
        <el-table-column
          prop="src_ip"
          label="来源地址"
        />
        <el-table-column
          prop="create_at"
          label="创建时间"
          width="180"
        />
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
        />
        <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="280">
          <template slot-scope="{row}">
            <template>
              <el-button v-if="row.status === '运行'" size="mini" type="warning" @click="pauseButton(row)">暂停</el-button>
              <el-button v-else size="mini" type="info" @click="resumeButton(row)">恢复</el-button>
            </template>
            <el-button size="mini" type="success" @click="infoFormVisible(row)">
              详情
            </el-button>
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
      <AddTableData
        :is-show.sync="addDialogFormVisible"
      />

    </el-card>

  </div>

</template>

<script>
import { REPOSITORY as masterApi } from '@/api/iac'
import AddTableData from './components/add'
import moment from 'moment'
export default {
  name: 'Index',
  components: {
    AddTableData
  },
  filters: {
    formatDate: function(date) {
      return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      addDialogFormVisible: false,
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      schedulerList: [],
      methodOptions: { 'ddd': 'aa' },
      task_status: [{ id: 1, name: '运行' }, { id: 2, name: '暂停' }],
      task_type: [{ id: 1, name: '快速执行' }, { id: 2, name: '状态管理' }],
      searchInfo: {
        type: '',
        status: '',
        search: ''
      },
      multipleSelection: []
    }
  },
  created() {
    this.GetList()
  },
  methods: {
    deleteButton(row) {
      this.$confirm('正在删除任务调度, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '调度任务删除已提交!'
          })
        })
      })
    },
    resumeButton(row) {
      this.$confirm('正在恢复任务调度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const params = {}
        masterApi.resume(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '调度任务恢复申请已提交!'
          })
        })
      })
    },
    pauseButton(row) {
      this.$confirm('正在暂停任务调度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const params = {}
        masterApi.pause(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '任务调度暂停申请已提交!'
          })
        })
      })
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
        this.schedulerList = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    onReset() {
      this.searchInfo = {}
    },
    addData() {
      this.addDialogFormVisible = false
      this.addDialogFormVisible = true
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
        status: this.searchInfo.status,
        type: this.searchInfo.type,
        page: 1,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.schedulerList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    }
  }
}
</script>

<style scoped>

</style>
