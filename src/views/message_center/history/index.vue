<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div>
        <el-form :inline="true" :model="searchInfo">
          <el-form-item label="模糊搜索">
            <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容" />
          </el-form-item>

          <el-form-item style="float:right ">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="getSearchData">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="searchOnReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px" shadow="hover">
      <div style="margin-bottom: 20px">
        <el-button @click="addData('create')">新增</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="dataList"
        border
        :cell-style="{textAlign:&quot;center&quot;}"
        :header-cell-style="{textAlign: 'center',background:'#fafafa',color:'#606266'}"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="tableSelectChange"
      >
        <el-table-column
          label="序号"
          fixed="left"
          type="index"
          width="80"
        />
        <el-table-column
          prop="app_name"
          label="应  用"
          width="180"
        />
        <el-table-column
          prop="name"
          label="主  题"
          width="220"
        />
        <el-table-column
          prop="status"
          label="通告状态"
          width="120"
        />
        <el-table-column
          prop="type_name"
          label="通告类型"
          width="120"
        />
        <el-table-column
          prop="level_name"
          width="180"
          label="通告级别"
        />
        <el-table-column
          prop="summary"
          width="600"
          label="概要信息"
        />
        <el-table-column
          prop="start_at"
          label="开始时间"
          width="200"
        />
        <el-table-column
          prop="end_at"
          label="结束时间"
          width="200"
        />
        <el-table-column
          prop="duration"
          label="持续时间"
          width="180"
        />
        <!--          show-overflow-tooltip-->

        <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="230">
          <template slot-scope="{row}">
            <!--            <el-button size="mini" type="" @click="infodata(row)">-->
            <!--              详情-->
            <!--            </el-button>-->
            <el-button size="mini" type="success" @click="infoFormFunc(row)">
              详情
            </el-button>
            <el-button size="mini" type="danger" @click="deleteData(row)">
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
        :show-visible.sync="addDialogFormVisible"
        :add-form-data.sync="addRowData"
        :method-visible.sync="addMethodVisible"
        @show-func="addShowFunc"
      />
    </el-card>

  </div>

</template>

<script>
import { History as masterApi } from '@/api/message-center'
import AddTableData from './components/add'
import moment from 'moment'
import { getPageQueryList } from '@/utils/page-query'

const defaultAddData = {
  app_name: '',
  name: '',
  type: '',
  level: '',
  instance: '',
  labels: '',
  summary: '',
  description: '',
  start_at: '',
  end_at: '',
  duration: '',
  user: '',
  is_all: false,
  is_at: true
}

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
      mainDetailData: '',
      mainVisible: false,
      // info 跳转路由名
      infoRouteNmae: 'IAC_REPOSITORY_DETAIL',
      // 新增form表单
      addDialogFormVisible: false,
      addRowData: JSON.parse(JSON.stringify(defaultAddData)),
      addMethodVisible: 'create',
      // 表格多选相关
      tableChangeList: [],
      dataList: [],
      // 搜索相关
      pageQuerylist: JSON.parse(JSON.stringify(getPageQueryList())),
      searchInfo: {
        type: '',
        status: '',
        search: ''
      }

    }
  },
  created() {
    this.GetList()
  },
  methods: {
    infoFormFunc(row) {
      this.$router.push({ name: 'MESSAGE_CENTER_HISTORY_DETAIL', query: { id: row.id }})
    },
    addShowFunc(val) {
      this.methodVisible = 'create'
      this.addDialogFormVisible = false
      this.addRowData = JSON.parse(JSON.stringify(defaultAddData))
      this.GetList()
    },
    deleteData(row) {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    GetList() {
      masterApi.list({
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.dataList = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    searchOnReset() {
      this.searchInfo = {}
    },
    addData(val) {
      if (val === 'create') {
        this.addMethodVisible = 'create'
        this.addDialogFormVisible = false
        this.addDialogFormVisible = true
        this.addRowData = JSON.parse(JSON.stringify(defaultAddData))
      }
    },
    // 多选表格相关
    tableSelectChange(val) {
      this.tableChangeList = []
      for (var key in val) {
        this.tableChangeList.push(Number(val[key]['id']))
      }
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getSearchDataVal()
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.getSearchDataVal()
    },
    getSearchDataVal() {
      const params = {
        from_periodic_null: this.searchInfo.from_periodic_null,
        repository: this.searchInfo.repository,
        state: this.searchInfo.state,
        search: this.searchInfo.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.dataList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    },

    getSearchData() {
      this.pageQuerylist.page = 1
      this.getSearchDataVal()
    }
  }
}
</script>

<style scoped>

</style>
