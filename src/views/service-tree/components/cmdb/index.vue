<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="tabHandleClick">
      <el-tab-pane
        v-for="(item) in classifyList"
        :key="item.id"
        :label="item.classify_name"
        :name="numToStr(item.id)"
      >
        <div>
          <el-card class="box-card">
            <div class="text item">
              <div class="filter-container">
                <el-input
                  v-model="search"
                  class="input-with-select"
                  clearable
                  placeholder="请输入搜索内容"
                  style="width: 500px"
                  @keyup.enter.native="searchFilter"
                >
                  <el-button slot="append" icon="el-icon-search" @click="searchFilter" />
                </el-input>
                <el-button style="float: right; " @click="bindStart">绑定</el-button>
              </div>
              <el-table :data="tableList" border style="width: 100%;">
                <el-table-column type="index" width="50" label="序号" fixed />
                <el-table-column
                  v-for="(ite, index) in tableColumns"
                  :key="index"
                  v-bind="ite"
                  :label="ite.label"
                  :prop="ite.props"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[ite.props] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="160">
                  <template slot-scope="scope">
                    <el-button plain type="primary" size="mini" @click="unBindTableData(scope.row)">解绑</el-button>
                    <el-button plain type="success" size="mini" @click="detailTableData(scope.row)">详情</el-button>

                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-show="pageQuerylist.total>0"
                :current-page="pageQuerylist.page"
                :page-size="pageQuerylist.limit"
                :page-sizes="pageQuerylist.sizes"
                :total="pageQuerylist.total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </div>
          </el-card>
          <bindAssets :is-show.sync="showBindAsset" :binds="item" />

        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="绑定类型" :visible.sync="dialogTableVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="主类型">
          <el-select v-model="formInline.pid" clearable @change="getSecondList">
            <el-option v-for="item in mainList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item />
      </el-form>
      <el-table
        :data="secondList"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          label="序号"
          type="index"
          width="80"
        />

        <el-table-column
          align="center"
          label="名称"
          prop="name"
          width="200px"
        />
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="260">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handlBind(row)">
              绑定
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { STNodeClassify as masterApi } from '@/api/server-tree'
import { numToStr } from '@/utils/tools'
import { Classify as CMDBClassify, Classify } from '@/api/data-map'
import bindAssets from '@/views/service-tree/components/cmdb/bindAssets'
import { STNodeAsset } from '@/api/server-tree'
export default {
  name: '',
  components: {
    bindAssets
  },
  props: {
    nodes: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formInline: {},
      mainList: [],
      classifyList: [],
      secondList: [],
      editableTabsValue: '',
      tabIndex: 2,
      numToStr,
      dialogTableVisible: false,
      showBindAsset: false,
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      tableColumns: [],
      tableList: [],
      search: '',
      linkNodeID: ''
    }
  },
  watch: {
    showBindAsset(newVal) {
      if (newVal === false) {
        this.searchData()
      }
    }
  },
  created() {
    this.checkLevel()
  },
  methods: {
    detailTableData(row) {
      this.$router.push({ name: 'CMDBAssetInfo', query: { id: row.asset }})
    },
    unBindTableData(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STNodeAsset.delete(row.id).then(() => {
          this.searchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    searchFilter() {
      this.pageQuerylist.page = 1
      this.pageQuerylist.size = 10
      this.searchData()
    },
    searchData() {
      if (this.linkNodeID === undefined || this.linkNodeID === null || this.linkNodeID === '') {
        return false
      }

      const params = {
        node_link: this.linkNodeID,
        search: this.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      STNodeAsset.list(params).then(res => {
        if (res.code === -1) {
          this.$message.error(res.message)
        } else {
          console.log(res)
          this.tableObj = res.data.result ? res.data.result : res.data
          this.pageQuerylist.total = res.data.count
          this.formatTableData(this.tableObj)
        }
        this.noSelect = false
      })
    },
    formatTableData(tableObj) {
      const fields = tableObj ? tableObj.fields : {}
      let theadList = []
      for (const key in fields) {
        theadList.push({
          props: key,
          label: tableObj.fields[key]['name'],
          order: tableObj.fields[key]['order']
        })
      }
      theadList.sort((a, b) => a.order - b.order)
      // 规则校验
      const rules = tableObj ? tableObj.rules : {}
      for (const key in rules) {
        theadList = theadList.map(item => {
          if (item.props === key) {
            item = { ...item, ...rules[key] }
          }
          return item
        })
      }
      this.tableColumns = theadList

      const data = tableObj ? tableObj.data : []
      this.tableList = data.map(item => {
        const obj = { ...item, ...item.data }
        return obj
      })
    },
    bindStart() {
      this.showBindAsset = true
    },
    handlBind(val) {
      const params = { classify: val.id, node: this.nodes.pk }
      masterApi.create(params).then((request) => {
        this.dialogTableVisible = false
        this.checkLevel()
        this.$notify({
          title: '成功',
          message: '创建数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 获取子类型
    getSecondList(val) {
      this.formInline.classify_id = ''
      const params = { pid: val }
      CMDBClassify.list(params).then(res => {
        this.secondList = res.data.result ? res.data.result : res.data
      })
    },
    // 获取 cmdb 主类型
    getCmdbClassifyParent() {
      Classify.parent().then(res => {
        this.mainList = res.data.result ? res.data.result : res.data
      })
    },
    tabHandleClick(tab, event) {
      this.linkNodeID = ''
      this.linkNodeID = parseInt(tab.name)
      this.searchData()
    },
    checkLevel() {
      if (this.nodes.level !== 4) {
        this.$message({
          message: '当前Node节点不允许当前操作!',
          type: 'warning'
        })
      } else {
        this.classifyList = []
        this.getNodeClassify()
      }
    },
    getNodeClassify() {
      masterApi.list({ node_id: this.nodes.pk }).then(res => {
        console.log(res)
        this.classifyList = res.data
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.mainList = []
        this.secondList = []
        this.dialogTableVisible = true
        this.getCmdbClassifyParent()
      }
      if (action === 'remove') {
        if (targetName === '首页') {
          this.$message({
            type: 'warning',
            message: '默认属性禁止删除操作'
          })
        } else {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.delete(parseInt(targetName)).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.classifyList = []
              this.getNodeClassify()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
