<template>
  <el-dialog title="数据绑定" :visible.sync="isShow" :before-close="handleClose" :modal-append-to-body="false" :close-on-click-modal="false">
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
    </div>
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
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button plain type="primary" size="mini" @click="bindTableData(scope.row)">绑定</el-button>

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
  </el-dialog>
</template>

<script>
import { CMDBAssets as masterApi } from '@/api/data-map'
import { STNodeAsset } from '@/api/server-tree'

export default {
  name: 'BindAssets',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    binds: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      menuSize: 'mini',
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
      search: ''

    }
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        console.log(newVal)
      }
    }
  },
  created() {
    this.searchData()
  },
  methods: {
    bindTableData(row) {
      const params = {
        node_link: this.binds.id,
        asset: row.id
      }
      STNodeAsset.create(params).then((request) => {
        this.$notify({
          title: '成功',
          message: '数据绑定成功!',
          type: 'success',
          duration: 2000
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
      if (this.binds === undefined || this.binds.classify === undefined || this.binds.classify === null || this.binds.classify === '') {
        return false
      }
      const params = {
        classify_id: this.binds.classify,
        search: this.search,
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
    bindStart() {
      this.showBindAsset = true
    },
    handleClose() {
      this.$emit('update:isShow', false)
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
    }

  }
}
</script>

<style scoped>

</style>
