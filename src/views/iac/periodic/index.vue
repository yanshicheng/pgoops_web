<template>
  <div>
    <el-card class="box-card" shadow="hover" style="background-color: #fafafa">
      <div>
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="模糊搜索">
            <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容" />
          </el-form-item>
          <el-form-item label="调度方法">
            <el-select v-model="searchInfo.periodic_method" filterable clearable placeholder="请选择">
              <el-option
                v-for="(v,k) in periodic_method_dic"
                :key="k"
                :label="v"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="调度状态">
            <el-select v-model="searchInfo.enabled" filterable clearable placeholder="请选择">
              <el-option
                v-for="(v,k) in enabled_dic"
                :key="k"
                :label="v"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="调度项目">
            <el-select v-model="searchInfo.repository" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in repositoryList"
                :key="item.id"
                :label="item.project_name"
                :value="item.id"
              />
            </el-select>
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
        @selection-change="searchData"
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
          prop="name"
          label="任务名"
          width="220"
        />
        <el-table-column
          prop="repository_name"
          label="项目"
          width="180"
        />
        <el-table-column
          prop="name"
          label="调度方式"
          width="160"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.interval" type="warning">INTERVAL</el-tag>
            <el-tag v-else>CRONTAB</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="调度计划"
          width="240"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.interval" type="warning">{{ row.interval.every }}/{{ row.interval.period }}</el-tag>
            <el-tag v-else>分钟: {{ row.crontab.minute }} 小时: {{ row.crontab.hour }} 日: {{ row.crontab.day_of_month }} 月:
              {{ row.crontab.month_of_year }} 星期:{{ row.crontab.day_of_week }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="110"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.enabled === true" type="success">运 行</el-tag>
            <el-tag v-else type="info">暂 停</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_by"
          label="创建用户"
          width="180"
        />
        <el-table-column
          prop="updated_by"
          label="更新用户"
          width="180"
        />
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="180"
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

        <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="180">
          <template slot-scope="{row}">
            <!--            <el-button size="mini" type="success" @click="infoFormFunc(row)">-->
            <!--              详情-->
            <!--            </el-button>-->
            <el-button v-if="row.enabled" size="mini" type="info" @click="pauseData(row)">
              暂停
            </el-button>
            <el-button v-else size="mini" type="warning" @click="enableData(row)">
              启用
            </el-button>
            <!--            <el-button size="mini" type="warning" @click="downLoadFormFunc(row)">-->
            <!--              下载-->
            <!--            </el-button>-->
            <el-button size="mini" type="danger" @click="deleteFormFunc(row)">
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
      <!--      <RunTableData-->
      <!--        :show-visible.sync="addDialogFormVisible"-->
      <!--        :add-form-data.sync="addRowData"-->
      <!--        :method-visible.sync="addMethodVisible"-->
      <!--        @show-func="addShowFunc"-->
      <!--      />-->
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
import { REPOSITORY as repositoryApi, TaskPeriodic as masterApi } from '@/api/iac'
import AddTableData from './components/add'
// import MainDetail from './components/mainDetail'
import moment from 'moment'
import { getPageQueryList } from '@/utils/page-query'

const defaultSearchInfo = {
  type: '',
  status: '',
  search: '',
  from_periodic_null: '',
  state: '',
  repository: '',
  periodic_method: '',
  enabled: '',
  alert: false
}
const defaultaddFormData = {
  name: '',
  repository: '',
  playbook: '',
  inventory: [],
  envvars: new Map(),
  extravars: new Map(),
  forks: 1,
  timeout: 3600,
  role: [],
  tags: [],
  skip_tags: [],
  crontab: {
    minute: '*/10',
    hour: '*',
    day_of_week: '*',
    day_of_month: '*',
    month_of_year: '*',
    timezone: 'Asia/Shanghai'
  },
  interval: {
    period: 'hours',
    every: 10
  },
  describe: ''
}
export default {
  name: 'Index',
  components: {
    AddTableData
    // MainDetail
  },
  filters: {
    formatDate: function(date) {
      return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      // 新增form表单
      addDialogFormVisible: false,
      addRowData: JSON.parse(JSON.stringify(defaultaddFormData)),
      addMethodVisible: 'create',
      // 表格多选相关
      tableChangeList: [],
      dataList: [],
      // 搜索相关
      pageQuerylist: JSON.parse(JSON.stringify(getPageQueryList())),
      searchInfo: JSON.parse(JSON.stringify(defaultSearchInfo)),
      repositoryList: [],
      periodic_method_dic: {
        'true': 'CRONTAB',
        'false': 'INTERVAL'
      },
      enabled_dic: {
        'true': '运行',
        'false': '暂停'
      }
    }
  },
  created() {
    this.GetList()
    this.GetRepository()
  },
  methods: {
    pauseData(row) {
      this.$confirm('正在停止暂停任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.pause(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '定时任务已停止!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    enableData(row) {
      this.$confirm('正在启动定时任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.enable(row.id).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '定时任务已启动!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    downLoadFormFunc(row) {
      masterApi.tar(row.id).then(response => {
        window.open(response.data.download_url)
      })
    },
    addShowFunc(val) {
      this.addMethodVisible = 'create'
      this.addDialogFormVisible = false
      this.addRowData = JSON.parse(JSON.stringify(defaultaddFormData))
      this.GetList()
    },
    deleteFormFunc(row) {
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
    infoFormFunc(row) {
      this.$router.push({ name: 'IAC_TASK_DETAIL', query: { id: row.id }})
    },
    onSubmit() {
    },
    GetRepository() {
      repositoryApi.list().then(res => {
        this.repositoryList = res.data
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
      this.searchInfo = JSON.parse(JSON.stringify(defaultSearchInfo))
    },
    addData(val) {
      if (val === 'create') {
        this.addMethodVisible = 'create'
        this.addRowData = JSON.parse(JSON.stringify(defaultaddFormData))
        this.addDialogFormVisible = false
        this.addDialogFormVisible = true
      } else {
        this.addRowData = val
        this.addMethodVisible = 'update'
        this.addDialogFormVisible = true
        this.addRowData = JSON.parse(JSON.stringify({
          name: val.name,
          repository: val.repository,
          inventories: val.inventories,
          envvars: val.envvars,
          extravars: val.extravars,
          forks: val.forks,
          timeout: val.timeout,
          tags: val.tags,
          skip_tags: val.skip_tags,
          describe: val.describe
        }))
      }
    },
    searchData(val) {
      this.multipleSelection = []
      for (var key in val) {
        this.multipleSelection.push(Number(val[key]['id']))
      }
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getSearchData()
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.getSearchData()
    },
    getSearchData() {
      const params = {
        search: this.searchInfo.search,
        periodic_method: this.searchInfo.periodic_method,
        repository: this.searchInfo.repository,
        enabled: this.searchInfo.enabled,
        page: 1,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.dataList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    }
  }
}
</script>

<style scoped>

</style>
