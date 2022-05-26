<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="6" style="padding-left: 7.5px; padding-right: 7.5px; margin-bottom: 15px;">
        <div class="grid-content bg-purple">

          <el-table
            ref="singleTable"
            highlight-current-row
            border
            :header-cell-style="{background:'#fafafa',color:'#606266'}"
            :data="groupList"
            style="width: 100%"
            @current-change="handleCurrentChange"
          >
            <el-table-column>
              <template slot="header">
                <el-button type="warning" size="small" icon="el-icon-share" @click="syncConsul">同步Consul</el-button>
              </template>
              <el-table-column
                label=""
                type="index"
                width="50px"
                style="textAlign: 'center'"
              />
              <el-table-column
                label="应用分组名称"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  <i class="el-icon-arrow-right" style="float: right" />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="18">
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
          </el-form>
        </div>
        <div class="grid-content bg-purple-light">
          <el-table
            border
            :max-height="tableHeight"
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign: 'center',background:'#fafafa',color:'#606266'}"
            :data="dataList"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
              fixed="left"
              width="80"
            />
            <el-table-column
              prop="asset_name"
              label="绑定资产"
              width="180px"
            />
            <el-table-column
              prop="scheme_name"
              label="scheme"
              width="80"
            />
            <el-table-column
              prop="port"
              label="端口"
              width="80"
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
              width="240"
            >
              <template slot-scope="{row}">
                <el-button size="mini" type="text" icon="el-icon-edit" style="margin: 0" @click="addOrEditRowFunc(row)">
                  编辑
                </el-button>
                <el-button size="mini" type="text" icon="el-icon-view " style="margin: 0" @click="monitorTableData(row)">
                  监控
                </el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" style="margin: 0" @click="deleteRowDataFunc(row,'')">
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
        </div>
      </el-col>
    </el-row>
    <AddPage
      :show-visible.sync="addIsVisible"
      :add-form-data.sync="addRowData"
      :method-visible.sync="addMethodVisible"
      :asset-name="assetName"
      @show-func="addPageShowFunc"
    />
    <DrawerMonitor
      :show-visible.sync="monitorVisible"
      :monitor-url="monitorUrl"
      :monitor-title="monitorTitle"
    />
  </el-card>

</template>

<script>
import { Application as masterApi } from '@/api/monitoring'
import { Group as groupApi } from '@/api/monitoring'
import AddPage from './components/addPage'
import { getPageQueryList } from '@/utils/page-query'
import DrawerMonitor from '../components/drawer_monitor'
const defaultaddRowData = {
  group: '',
  port: '',
  asset: '',
  scheme: 0
}

const defaultSearchInfo = {
  search: ''
}
export default {
  name: 'Index',
  components: {
    AddPage,
    DrawerMonitor
  },
  data() {
    return {
      monitorTitle: '',
      monitorUrl: '',
      monitorVisible: false,
      assetName: '',
      groupList: [],
      tableHeight: window.innerHeight - 290,
      rulesvisible: false,
      dataList: [],
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
    this.getGroup()
  },
  methods: {
    getGroup() {
      groupApi.list().then(res => {
        this.groupList = res.data
        this.$refs.singleTable.setCurrentRow(this.groupList[0])
        this.getList(this.groupList[0].id)
      })
    },
    addOrEditRowFunc(action) {
      if (action !== 'create') {
        this.addMethodVisible = 'update'
        this.addRowData = JSON.parse(JSON.stringify({
          id: action.id,
          group: action.group,
          port: action.port,
          asset: action.asset,
          scheme: action.scheme
        }))
        this.assetName = action.asset_name
        this.addIsVisible = true
      } else {
        this.addMethodVisible = 'create'
        this.addRowData = JSON.parse(JSON.stringify(defaultaddRowData))
        this.addRowData.group = this.actionRuleGroup.id
        this.addIsVisible = true
      }
    },
    addPageShowFunc() {
      this.rulesvisible = false
      this.addIsVisible = false
      this.assetName = ''
      this.addRowData = JSON.parse(JSON.stringify(defaultaddRowData))
      this.getList(this.actionRuleGroup.id)
    },
    getList() {
      masterApi.list({
        group: this.actionRuleGroup.id,
        search: this.searchInfo.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.dataList = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    syncConsul() {
      const loading = this.$loading({
        lock: true,
        text: '正在同步数据至Consul....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      masterApi.consul().then(res => {
        this.monitorUrl = res.data.url
        this.monitorTitle = res.data.title
        loading.close()
        this.$message({
          type: 'success',
          message: '同步成功!'
        })
      }).catch(() => {
        loading.close()
      })
    },
    monitorTableData(row) {
      const loading = this.$loading({
        lock: true,
        text: '监控加载中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      masterApi.monitor(row.id).then(res => {
        this.monitorUrl = res.data.url
        this.monitorTitle = res.data.title
        loading.close()
        this.monitorVisible = true
      }).catch(() => {
        loading.close()
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
    handlePageChange(val) {
      this.pageQuerylist.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.actionRuleGroup = val
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
