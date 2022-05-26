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
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign: 'center',background:'#fafafa',color:'#606266'}"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="tableSelectChange"
      >
        <el-table-column
          label="序号"
          type="index"
          fixed="left"
          width="80"
        />
        <el-table-column
          prop="name"
          label="英文名"
          width="220"
        />
        <el-table-column
          prop="cname"
          label="中文名"
          width="220"
        />
        <el-table-column
          label="等级类型"
          width="220"
        >
          <template slot-scope="{row}">
            <!--            <el-button size="mini" type="" @click="infodata(row)">-->
            <!--              详情-->
            <!--            </el-button>-->
            <el-tag v-if="row.is_system" type="info">内置等级</el-tag>
            <el-tag v-else type="success">自定义等级</el-tag>
          </template>

        </el-table-column>
        <el-table-column
          prop="weight"
          label="排序"
          width="100"
          sortable
        />
        <el-table-column
          prop="provider_name"
          label="通知媒介"
          width="220"
        />
        <el-table-column
          prop="group_name"
          label="通知组"
          width="220"
        />

        <el-table-column
          prop="created_at"
          label="创建时间"
          width="200"
        />
        <el-table-column
          prop="updated_at"
          label="更新时间"
          width="200"
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
            <el-button size="mini" type="text" icon="el-icon-bell" @click="testFormFunc(row)">
              测试
            </el-button>
            <el-button v-if="row.is_system === false" size="mini" icon="el-icon-delete" type="text" @click="deleteData(row)">
              删除
            </el-button>
            <el-button v-else size="mini" type="text" icon="el-icon-delete" disabled @click="deleteData(row)">
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
        @current-change="handlePageChange"
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
import { History as historyApi, Level as masterApi } from '@/api/message-center'
import AddTableData from './components/add'
import moment from 'moment'
import { getPageQueryList } from '@/utils/page-query'

const defaultAddData = {
  name: '',
  cname: '',
  provider: '',
  group: '',
  weight: ''
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
    this.getList()
  },
  methods: {
    testFormFunc(row) {
      this.$confirm('正在测试通知等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '通知等级测试中请等候....',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        historyApi.test({ level_id: row.id }).then(res => {
          loading.close()
          this.$notify({
            title: '成功',
            message: '通知等级测试成功，请检查!',
            type: 'success',
            duration: 5000
          })
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消测试'
        })
      })
    },
    addShowFunc(val) {
      this.methodVisible = 'create'
      this.addDialogFormVisible = false
      this.addRowData = JSON.parse(JSON.stringify(defaultAddData))
      this.getList()
    },
    deleteData(row) {
      this.$confirm('正在删除任务调度, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(row.id).then(() => {
          this.getList()
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
    getList() {
      masterApi.list({
        from_periodic_null: this.searchInfo.from_periodic_null,
        repository: this.searchInfo.repository,
        state: this.searchInfo.state,
        search: this.searchInfo.search,
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
      } else {
        this.addMethodVisible = 'update'
        this.addDialogFormVisible = true
        this.addRowData = JSON.parse(JSON.stringify({
          'name': val.name,
          'cname': val.cname,
          'provider': val.provider,
          'group': val.group,
          'weight': val.weight,
          'id': val.id
        }))
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
      this.getList()
    },
    handlePageChange(val) {
      this.pageQuerylist.page = val
      this.getList()
    },

    getSearchData() {
      this.pageQuerylist.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
