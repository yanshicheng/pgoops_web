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
                <el-button type="warning" size="small" icon="el-icon-share" @click="distributeConfigFunc()">规则下发</el-button>
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-download"
                  @click="getGroupAllRules"
                >全部下载
                </el-button>
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
              @click="getGroupRules()"
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
              prop="name"
              label="规则名"
              width="220"
            />
            <el-table-column
              prop="status"
              label="状态"
              width="220"
            >
              <template slot-scope="{row}">
                <span v-if="row.status">已启用</span>
                <span v-else>已禁用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="promeql"
              label="PromeQL"
              width="320"
            />
            <el-table-column
              prop="condition_name"
              label="触发条件"
              width="80"
            />
            <el-table-column
              prop="threshold_value"
              label="触发阈值"
              width="120"
            />
            <el-table-column
              prop="duration"
              label="持续时长"
              width="120"
            />
            <el-table-column
              prop="severity_name"
              label="告警级别"
              width="220"
            />
            <el-table-column
              prop="summary"
              label="概要信息"
              width="320"
            />
            <el-table-column
              prop="extend_labels"
              label="扩展标签"
              width="320"
            >
              <template slot-scope="{row}">
                <span v-if="row.extend_labels">{{ row.extend_labels }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述信息"
              width="420"
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
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <AddPage
      :show-visible.sync="addIsVisible"
      :add-form-data.sync="addRowData"
      :method-visible.sync="addMethodVisible"
      @show-func="addPageShowFunc"
    />
  </el-card>

</template>

<script>
import { Rules as masterApi } from '@/api/monitoring'
import { Group as groupApi } from '@/api/monitoring'
import AddPage from './components/addPage'
import { getPageQueryList } from '@/utils/page-query'

const defaultaddRowData = {
  group: '',
  name: '',
  promeql: '',
  status: true,
  condition: 0,
  threshold_value: 60,
  duration: 60,
  severity: '',
  summary: '',
  description: '',
  extend_labels: {}
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
    distributeConfigFunc() {
      this.$confirm('正在下发规则配置文件, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        groupApi.distribute_config().then(res => {
          this.$message({
            type: 'success',
            message: '规则配置文件下发成功!'
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
        text: 'prometheus rule 文件下载中....',
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
    getGroupAllRules() {
      groupApi.group_rules_all().then(res => {
        this.downloadYaml(res.data, 'pgoops_all_rules.yaml')
      })
    },
    getGroupRules() {
      groupApi.group_rules(this.actionRuleGroup.id).then(res => {
        this.downloadYaml(res.data, 'pgoops_' + this.actionRuleGroup.name + '.yaml')
      })
    },
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
        this.addRowData = JSON.parse(JSON.stringify(action))
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
      this.addRowData = JSON.parse(JSON.stringify(defaultaddRowData))
      this.getList(this.actionRuleGroup.id)
    },
    getList() {
      masterApi.list({
        group: this.actionRuleGroup.id,
        page: this.pageQuerylist.page,
        search: this.searchInfo.search,
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
