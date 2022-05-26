<template>
  <div>
    <el-card class="box-card" style="margin-top: 10px" shadow="hover">
      <div style="background: #fafafa;border:2px solid #f2f5fa;height: 50px;">
        <el-form :inline="true" :model="searchInfo" style="margin-left: 15px; margin-top: 7px">
          <el-form-item label="模糊搜索">
            <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容" />
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-refresh" @click="searchOnReset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="getSearchData">查询</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="addData('create')">新增</el-button>

          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="multipleTable"
        :data="dataList"
        border
        :max-height="tableHeight"
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign: 'center',background:'#fafafa',color:'#606266'}"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="tableSelectChange"
      >
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55"-->
        <!--        />-->
        <el-table-column
          label="序号"
          fixed="left"
          type="index"
          width="80"
        />
        <el-table-column
          prop="project_name"
          label="项目名"
          width="220"
        />
        <el-table-column
          label="包名"
          width="120"
        >
          <template slot-scope="{row}">
            <el-tag type="warning">{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="入口文件"
          width="180"
        >
          <template slot-scope="{row}">
            <el-button type="info" plain @click="getMainFile(row)">{{ row.main }}</el-button>
          </template>

        </el-table-column>
        <el-table-column
          prop="run_num"
          label="调用次数"
          width="120"
          sortable
        />
        <el-table-column
          prop="created_by"
          label="创建用户"
          width="120"
        />
        <el-table-column
          prop="updated_by"
          label="更新用户"
          width="120"
        />
        <el-table-column
          prop="created_at"
          width="180"
          label="创建时间"
        />
        <el-table-column
          prop="updated_at"
          label="更新时间"
          width="180"
        />
        <el-table-column
          prop="describe"
          label="描述"
          width="220"
        />
        <!--          show-overflow-tooltip-->

        <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="240">
          <template slot-scope="{row}">
            <!--            <el-button size="mini" type="" @click="infodata(row)">-->
            <!--              详情-->
            <!--            </el-button>-->
            <el-button size="mini" type="text" icon="el-icon-edit" @click="addData(row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-download" @click="downLoadFormFunc(row)">
              下载
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteData(row)">
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
      <MainDetail
        :main-visible="mainVisible"
        :main-detail-data="mainDetailData"
        @main-detail-func="mainDetailFunc"
      />
    </el-card>

  </div>

</template>

<script>
import { REPOSITORY as masterApi } from '@/api/iac'
import AddTableData from './components/add'
import MainDetail from './components/mainDetail'
import moment from 'moment'
import { getPageQueryList } from '@/utils/page-query'

export default {
  name: 'Index',
  components: {
    AddTableData,
    MainDetail
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
      addRowData: JSON.parse(JSON.stringify({})),
      addMethodVisible: 'create',
      // 表格多选相关
      tableChangeList: [],
      dataList: [],
      tableHeight: window.innerHeight - 290,
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
    mainDetailFunc(val) {
      this.mainVisible = false
      this.mainDetailData = ''
    },
    downLoadFormFunc(row) {
      masterApi.tar(row.id).then(response => {
        window.open(response.data.download_url)
      })
    },
    addShowFunc(val) {
      this.methodVisible = 'create'
      this.addDialogFormVisible = false
      this.addRowData = JSON.parse(JSON.stringify({}))
      this.GetList()
    },
    getMainFile(row) {
      masterApi.mainInfo(row.id).then((res) => {
        this.mainVisible = false
        this.mainDetailData = res.data.main_info
        this.mainVisible = true
      })
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
    infodata(row) {
      this.$router.push({ name: this.infoRouteNmae, query: { id: row.id }})
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
        this.addRowData = JSON.parse(JSON.stringify({}))
      } else {
        this.addMethodVisible = 'update'
        this.addDialogFormVisible = true
        this.addRowData = JSON.parse(JSON.stringify({ 'project_name': val.project_name, 'describe': val.describe, 'id': val.id }))
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
