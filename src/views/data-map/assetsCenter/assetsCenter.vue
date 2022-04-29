<template>
  <div class="assets-center-container">
    <div class="assets-center-operate">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="主类型">
          <el-select v-model="formInline.pid" clearable @change="getSecondList">
            <el-option v-for="item in mainList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="子类型">
          <el-select v-model="formInline.classify_id" clearable @change="getTabeList">
            <el-option v-for="item in secondList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.search" placeholder="" @keyup.enter.native="searchData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFilter">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" plain @click="addNewData">新增</el-button>
    </div>
    <div class="meta" />
    <div class="assets-center-container">
      <template v-if="tableColumns.length">
        <el-table :data="tableList" border style="width: 100%;">
          <el-table-column type="index" width="50" label="序号" fixed />
          <el-table-column
            v-for="(item, index) in tableColumns"
            :key="index"
            v-bind="item"
            :label="item.label"
            :prop="item.props"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.props] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="160">
            <template slot-scope="scope">
              <el-button plain type="primary" size="mini" @click="editTableData(scope.row)">编辑</el-button>
              <el-button plain type="danger" size="mini" @click="deleteData(scope.row.id, scope.$index, tableList)">删除
              </el-button>
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
      </template>
      <div v-else-if="noSelect" class="no-data">请选择主类型和子类型，来加载数据</div>
      <div v-else class="no-data">暂无数据</div>
    </div>
    <AddTableData
      :is-show.sync="showAddTableData"
      :fields="tableColumns"
      :classify-id="formInline.classify_id"
    />
    <EditTableData
      :is-show.sync="showEditDia"
      :fields="tableColumns"
      :classify-id="formInline.classify_id"
      :row-data="rowData"
    />
  </div>
</template>
<script>
import { Classify as CMDBClassify } from '@/api/data-map'
import { CMDBAssets as masterApi } from '@/api/data-map'
import AddTableData from '../datacenter/assetsCenter/AddTableData'
import EditTableData from '../datacenter/assetsCenter/EditTableData'

export default {
  name: '',
  components: {
    AddTableData,
    EditTableData
  },
  data() {
    return {
      formInline: {
        pid: '',
        classify_id: '',
        search: ''
      },
      tableObj: {},
      tableColumns: [],
      tableList: [],
      mainList: [],
      secondList: [],
      showAddTableData: false,
      showEditDia: false,
      rowData: {},
      noSelect: true,
      total: 0,
      currentPage: 1,
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      }
    }
  },
  created() {
    this.getMainList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.searchData()
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.searchData()
    },
    // 获取主列表
    getMainList() {
      CMDBClassify.parent().then(res => {
        this.mainList = res.data.result ? res.data.result : res.data
      })
    },
    // 获取子列表
    getSecondList(val) {
      this.formInline.classify_id = ''
      const params = { pid: val }
      CMDBClassify.list(params).then(res => {
        this.secondList = res.data.result ? res.data.result : res.data
      })
    },
    searchFilter() {
      this.pageQuerylist.page = 1
      this.pageQuerylist.size = 10
      this.searchData()
    },
    searchData() {
      if (this.formInline.classify_id === '') {
        this.$message.error('请选择类型')
        return false
      }
      const params = {
        classify_id: this.formInline.classify_id,
        search: this.formInline.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then(res => {
        if (res.code === -1) {
          this.$message.error(res.message)
        } else {
          this.tableObj = res.data.result ? res.data.result : res.data
          this.pageQuerylist.total = res.data.count
          this.formatTableData(this.tableObj)
        }
        this.noSelect = false
      })
    },
    // 获取table列表
    getTabeList(val) {
      if (!val) return false
      this.pageQuerylist.page = 1
      this.pageQuerylist.size = 10
      this.pageQuerylist.total = 0
      const params = { classify_id: val,
        search: this.formInline.search,
        page: 1,
        size: 10
      }
      masterApi.list(params).then(res => {
        if (res.code === -1) {
          this.$message.error(res.message)
        } else {
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
    addNewData() {
      if (this.formInline.classify_id === '') {
        this.$message.error('请选择类型')
        return false
      }
      this.showAddTableData = true
    },
    deleteData(id, index, tableList) {
      this.$confirm('是否确认删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(id).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.searchFilter()
            tableList.splice(index, 1)
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
      })
    },
    editTableData(row) {
      this.showEditDia = true
      this.rowData = Object.assign({}, row)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table th {
  text-align: center;
  font-weight: bold;
  color: #606266;
  background-color: #EBEEF5;
}

::v-deep .el-table--border, .el-table--group {
  border: 1px solid #DCDFE6;
}

::v-deep .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid #DCDFE6;
}

::v-deep .el-table td, .el-table th.is-leaf {
  border-bottom: 1px solid #DCDFE6;
}

::v-deep .el-table .el-table__header-wrapper .el-table__header th.is-leaf {
  border-bottom: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
}

::v-deep .el-table--border th, .el-table__fixed-right-patch {
  border-bottom: 1px solid #DCDFE6 !important;
}

::v-deep .el-card__header {
  background: rgb(217, 236, 255);
}

::v-deep .el-table th > .cell {
  display: inline-block;
  white-space: nowrap;
  word-break: keep-all;
  text-overflow: unset;
}

.assets-center-container {
  border-radius: 3px;
  transition: .2s;
  background-color: #fff;

  .assets-center-operate {
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  ::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }

  .meta {
    background-color: #fafafa;
    border-top: 1px solid #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height .2s;
  }

  .assets-center-container {
    padding: 24px;
    box-sizing: border-box;
  }

  ::v-deep .el-pagination {
    margin-top: 10px;
    text-align: center;
  }
}

</style>
