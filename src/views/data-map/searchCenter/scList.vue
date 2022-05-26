<template>
  <div class="assets-center-container">
    <div class="assets-center-operate">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="主类型">
          <el-select v-model="formInline.pid" clearable @change="getSecondList">
            <el-option v-for="item in mainList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="子类型" clearable>
          <el-select v-model="formInline.classify_id" @change="getTabeList">
            <el-option v-for="item in secondList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.search" placeholder="" @keyup.enter.native="searchData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="meta" />
    <div class="assets-center-container">
      <template v-if="tableList.length">
        <div v-for="(items, index) in tableList" :key="index" style="margin-bottom: 20px;">
          <el-card>
            <div slot="header" class="clearfix" style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:bold;font-size:16px;color: #303133;">{{ items.name }}</span>
            </div>
            <el-table :data="items.tableList" border style="width: 100%">
              <el-table-column type="index" width="50" label="序号" fixed />
              <el-table-column
                v-for="(item, i) in items.theadList"
                :key="i"
                v-bind="item"
                :max-height="tableHeight"
                :label="item.label"
                :prop="item.props"
              >
                <!--                :width="flexColumnWidth(item.label,item.props)"-->

                <template slot-scope="scope">
                  <span>{{ scope.row[item.props] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-view" @click="checkDetailInfo(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </template>
      <div v-else-if="noSelect" class="no-data">请选择主类型和子类型，来加载数据</div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { Classify as CMDBClassify } from '@/api/data-map'
import { CMDBAssets as masterApi } from '@/api/data-map'

export default {
  name: '',
  data() {
    return {
      formInline: {
        pid: '',
        classify_id: '',
        search: ''
      },
      tableHeight: window.innerHeight - 290,
      tableObj: {},
      tableColumns: [],
      tableList: [],
      mainList: [],
      secondList: [],
      showAddTableData: false,
      showEditDia: false,
      rowData: {},
      noSelect: true
    }
  },
  created() {
    this.getMainList()
  },
  methods: {
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          const calcLen = this.getTextWidth(item)
          if (acc < calcLen) {
            acc = calcLen
          }
        }
        return acc
      }, 0)
    },
    getTextWidth(str) {
      let width = 0
      const html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
    flexColumnWidth(label, prop) {
      // 1.获取该列的所有数据
      const arr = this.tableList.map(x => x[prop])
      arr.push(label) // 把每列的表头也加进去算
      // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
      return (this.getMaxLength(arr) + 25) + 'px'
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
    // 查询按钮
    searchData() {
      const params = { classify_id: this.formInline.classify_id, search: this.formInline.search }
      masterApi.search(params).then(res => {
        if (res.code === -1) {
          this.$message.error(res.message)
        } else {
          this.tableList = this.formatTableList(res.data)
        }
        this.noSelect = false
      })
    },
    // 获取table列表
    getTabeList(val) {
      if (!val) return false
      const params = { classify_id: val }
      masterApi.search(params).then(res => {
        if (res.code === -1) {
          this.$message.error(res.message)
        } else {
          this.tableList = this.formatTableList(res.data)
        }
        this.noSelect = false
      })
    },
    // 格式化table数据
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
    formatTableList(children) {
      const allTableData = []
      children.forEach(items => {
        const fields = items ? items.fields : {}
        let theadList = []
        for (const key in fields) {
          theadList.push({
            props: key,
            label: items.fields[key]['name'],
            order: items.fields[key]['order']
          })
        }
        theadList.sort((a, b) => a.order - b.order)
        // 规则校验
        const rules = items ? items.rules : {}
        for (const key in rules) {
          theadList = theadList.map(item => {
            if (item.props === key) {
              item = { ...item, ...rules[key] }
            }
            return item
          })
        }
        const data = items ? items.data : []
        const tableList = data.map(item => {
          const obj = { ...item, ...item.data }
          return obj
        })
        const tableObj = {
          theadList,
          tableList,
          name: items.classify_name,
          id: items.classify_id
        }
        allTableData.push(tableObj)
      })
      return allTableData
    },
    // 查看详情
    checkDetailInfo(row) {
      this.$router.push({ name: 'CMDBAssetInfo', query: { id: row.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.assets-center-container {
  // border: 1px solid #ebebeb;
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
}
</style>
