<template>
  <el-card class="box-card">
    <div style="background: #fafafa;border:2px solid #f2f5fa;height: 50px">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="模糊搜索" style="margin-left: 15px; margin-top: 7px">
          <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容" />
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 5px; margin-top: 7px"
          @click="getSearchData"
        >搜索
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          style="margin-left: 15px; margin-top: 7px"
          @click="addOrEditRowFunc('create')"
        >新增
        </el-button>
        <el-button
          type="success"
          size="small"
          icon="el-icon-download"
          style="margin-left: 15px; margin-top: 7px"
          @click="deleteRowDataFunc('','group')"
        >分组下载
        </el-button>
        <el-button
          type="success"
          size="small"
          icon="el-icon-download"
          style="margin-left: 15px; margin-top: 7px"
          @click="deleteRowDataFunc('','group')"
        >全部下载
        </el-button>
      </el-form>
    </div>
    <div class="grid-content bg-purple-light">
      <el-table
        border
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign: 'center',background:'#fafafa',color:'#606266'}"
        :data="dataList"
        :max-height="tableHeight"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          type="index"
          fixed="left"
          width="80"
        />
        <el-table-column
          prop="name"
          label="组  名"
          width="100px"
        />
        <el-table-column
          prop="scheme_name"
          label="scheme name"
          width="100px"
        />
        <el-table-column
          prop="metrics_path"
          label="metrics path"
          width="100px"
        />
        <el-table-column
          prop="grafana_path"
          label="grafana path"
          width="280px"
        />
        <el-table-column
          prop="consul_tag"
          label="consul tag"
          width="100px"
        />
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="180px"
        />
        <el-table-column
          prop="updated_at"
          label="更新时间"
          width="180px"
        />
        <el-table-column
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          label="操作"
          width="180"
        >
          <template slot-scope="{row}">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="addOrEditRowFunc(row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteRowDataFunc(row,'')">
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
        @current-change="handlepageChange"
      />
    </div>
    <AddPage
      :show-visible.sync="addIsVisible"
      :add-form-data.sync="addRowData"
      :method-visible.sync="addMethodVisible"
      @show-func="addPageShowFunc"
    />
  </el-card>

</template>

<script>
import { Group as masterApi } from '@/api/monitoring'
import AddPage from './components/addPage'
import { getPageQueryList } from '@/utils/page-query'

const defaultaddRowData = {
  name: '',
  scheme: 0,
  metrics_path: '/metrics',
  consul_tag: '',
  grafana_path: ''
}

const defaultSearchInfo = {
  search: ''
}
export default {
  name: 'Index',
  components: {
    AddPage
  },
  data() {
    return {
      rulesvisible: false,
      dataList: [],
      tableHeight: window.innerHeight - 290,
      actionRuleGroup: {},
      addIsVisible: false,
      addRowData: JSON.parse(JSON.stringify(defaultaddRowData)),
      addMethodVisible: 'create',
      rulesGroupDataList: [],
      pageQuerylist: JSON.parse(JSON.stringify(getPageQueryList())),
      searchInfo: JSON.parse(JSON.stringify(defaultSearchInfo))
    }
  },
  created() {
    this.getList()
  },
  methods: {
    addOrEditRowFunc(action) {
      if (action !== 'create') {
        this.addMethodVisible = 'update'
        this.addRowData = JSON.parse(JSON.stringify(action))
        this.addIsVisible = true
      } else {
        this.addMethodVisible = 'create'
        this.addRowData = JSON.parse(JSON.stringify(defaultaddRowData))
        this.addIsVisible = true
      }
    },
    addPageShowFunc() {
      this.rulesvisible = false
      this.addIsVisible = false
      this.addRowData = JSON.parse(JSON.stringify(defaultaddRowData))
      this.getList()
    },
    getList() {
      masterApi.list({
        search: this.searchInfo.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.dataList = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    deleteRowDataFunc(row, mode) {
      this.$confirm('正在删除数据, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(row.id).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getList()
    },
    handlepageChange(val) {
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
::v-deep .ele-table-tool-default {
  margin-bottom: 0;
  padding: 5px 15px;
  box-sizing: border-box;
  background: #fafafa;
  border-top: #fafafa;
  border-left: #fafafa;
  border-right: #fafafa;
}
</style>
