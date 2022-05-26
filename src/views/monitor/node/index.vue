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
          type="warning"
          size="small"
          icon="el-icon-share"
          style="margin-left: 15px; margin-top: 7px"
          @click="distributeConfigFunc('','group')"
        >下发配置
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
          prop="host_name"
          label="主机"
          width="180px"
        />
        <el-table-column
          prop="master"
          label="联邦主节点"
          width="180px"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.master" type="danger">主节点</el-tag>
            <el-tag v-else type="success">Node节点</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="180px"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.status" type="">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="scheme_name"
          label="scheme"
          width="180px"
        />
        <el-table-column
          prop="port"
          label="端口号"
          width="180px"
        />
        <el-table-column
          prop="config_path"
          label="配置文件路径"
          width="380px"
        />
        <el-table-column
          prop="rules_path"
          label="规则文件路径"
          width="380px"
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
          width="310"
        >
          <template slot-scope="{row}">
            <el-button size="mini" type="text" icon="el-icon-edit" style="margin: 0" @click="addOrEditRowFunc(row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-download"
              style="margin: 0"
              @click="downloadConfigFunc(row)"
            >
              下载配置
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-view " style="margin: 0" @click="addOrEditRowFunc(row)">
              监控
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              style="margin: 0"
              @click="deleteRowDataFunc(row,'')"
            >
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
    <AddPage
      :show-visible.sync="addIsVisible"
      :add-form-data.sync="addRowData"
      :method-visible.sync="addMethodVisible"
      :asset-name="assetName"
      @show-func="addPageShowFunc"
    />
  </el-card>

</template>

<script>
import { Node as masterApi } from '@/api/monitoring'
import { Group as groupApi } from '@/api/monitoring'
import AddPage from './components/addPage'
import { getPageQueryList } from '@/utils/page-query'

const defaultaddRowData = {
  host: '',
  port: '',
  config_path: '',
  rules_path: '',
  status: true,
  master: false,
  scheme: 0
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
    this.getList()
  },
  methods: {
    distributeConfigFunc() {
      this.$confirm('正在下发配置文件, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.distribute_config().then(res => {
          this.$message({
            type: 'success',
            message: '配置文件下发成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    downloadYaml(data, name) {
      const loading = this.$loading({
        lock: true,
        text: 'prometheus config 文件下载中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        // console.log(Json2yaml.stringify(data))
        const yamlStr = data
        const export_blob = new Blob([yamlStr])
        const link = document.createElement('a')
        const url = window.URL || window.webkitURL || window.moxURL
        link.href = url.createObjectURL(export_blob)
        link.setAttribute('download', name)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        url.revokeObjectURL(link.href)
        loading.close()
      } catch (e) {
        this.$message.error('下载的文件出错', e)
        loading.close()
      }
    },
    getGroup() {
      groupApi.list().then(res => {
        this.groupList = res.data
        this.$refs.singleTable.setCurrentRow(this.groupList[0])
        this.getList(this.groupList[0].id)
      })
    },
    downloadConfigFunc(row) {
      masterApi.download_config(row.id).then(res => {
        this.downloadYaml(res.data, 'prometheus.yml')
      })
    },
    addOrEditRowFunc(action) {
      if (action !== 'create') {
        this.addMethodVisible = 'update'
        this.addRowData = JSON.parse(JSON.stringify({
          id: action.id,
          host: action.host,
          port: action.port,
          config_path: action.config_path,
          rules_path: action.rules_path,
          status: action.status,
          master: action.master,
          scheme: action.scheme
        }))
        this.assetName = action.host_name
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
