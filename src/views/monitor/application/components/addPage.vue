<template>
  <div>
    <el-dialog
      :title="methodVisible==='create'?dialogCreateTitle:dialogUpdateTitle"
      :width="dialogWidth"
      :visible.sync="isVisibleShow"
      :close-on-click-modal="false"
      style="height: 600px;overflow: auto;"
      @close="closeForm('addFormData')"
    >
      <el-form ref="addFormData" :model="addFormData" label-width="30%" class="demo-ruleForm">
        <el-form-item label="绑定资产: " required prop="asset">
          <el-tag v-if="!assetActionLabel" type="info" effect="dark">请选择资产</el-tag>
          <el-tag v-else type="" effect="dark">{{ assetActionLabel }}</el-tag>
          <el-button type="primary" style="float: right;margin-right: 40%" @click="assetClickFunc">选择</el-button>
        </el-form-item>
        <el-form-item label="应用组: " required prop="group">
          <el-select v-model="addFormData.group" placeholder="请选择应用组">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="scheme : " required prop="scheme">
          <el-select v-model="addFormData.scheme" placeholder="请选择">
            <el-option
              v-for="item in conditionChoices"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="端口号: " required prop="port">
          <el-input v-model="addFormData.port" type="number" style="width: 60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormData('addFormData')">重置</el-button>
        <el-button type="primary" @click="methodVisible==='create'?createFormData('addFormData'):updateFormData()">提 交
        </el-button>
        <el-button @click="closeForm('addFormData')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="请选择资产"
      :visible.sync="assetDialogVisible"
      :close-on-click-modal="false"
      width="70%"
      :before-close="assetHandleClose"
    >
      <div>

        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="主分类: " style="margin-left: 15px; margin-top: 7px">
            <el-select v-model="classifyId" placeholder="请选择资产分类" @change="getAsset">
              <el-option
                v-for="item in classifyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
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
        </el-form>
      </div>
      <!--      :width="flexColumnWidth(item.label,item.prop)"-->

      <el-table :data="tableList" border style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" fixed />
        <el-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          v-bind="item"
          stripe
          :width="flexColumnWidth(item.label,item.props)"
          :label="item.label"
          :prop="item.props"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.props] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-circle-plus-outline" @click="bindAssetFunc(scope.row.id, scope.$index, tableList)">选择
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
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>

</template>

<script>

import { Application as masterApi } from '@/api/monitoring'
import { Group as groupApi } from '@/api/monitoring'
import { Level as LevelApi } from '@/api/message-center'
import { getPageQueryList } from '@/utils/page-query'
import { CMDBAssets as assetApi } from '@/api/data-map'

const defaultSearchInfo = {
  search: ''
}
const defaultgroupAddRowData = {
  group: '',
  port: '',
  asset: '',
  scheme: 0
}
export default {
  name: 'Index',
  props: {
    showVisible: {
      type: Boolean,
      default:
        false
    },
    addFormData: {
      type: Object,
      default: JSON.parse(JSON.stringify(defaultgroupAddRowData))
    },
    methodVisible: {
      type: String,
      default: 'create'
    },
    assetName: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      classifyKey: '',
      actionAsset: [],
      tableList: [],
      tableColumns: [],
      assetActionLabel: '',
      classifyId: '',
      classifyList: [],
      searchInfo: JSON.parse(JSON.stringify(defaultSearchInfo)),
      pageQuerylist: JSON.parse(JSON.stringify(getPageQueryList())),
      assetDialogVisible: false,
      asset_name: '',
      groupList: [],
      labelKey: '',
      labelValue: '',
      levelList: [],
      durationSelect: 's',
      conditionChoices: [
        {
          id: 0,
          label: 'http'
        },
        {
          id: 1,
          label: 'https'
        }
      ],
      isVisibleShow: this.showVisible,
      dialogCreateTitle: '新增资产',
      dialogUpdateTitle: '更新资产',
      dialogWidth: '40%',

      // tempData: Object.assign({}, defaultRole),
      // addFormData: JSON.parse(JSON.stringify(defaultRuleaddRowData)),
      addDialogFormVisible: false,
      multipleSelection: [],
      userList: []
    }
  },
  watch: {
    showVisible(newName, oldName) {
      this.isVisibleShow = newName
    },
    assetName(newName, oldName) {
      this.assetActionLabel = newName
    }
  },
  created() {
    this.GetGroup()
    this.getClassify()
  },
  methods: {
    bindAssetFunc(id, index, row) {
      this.addFormData.asset = id
      this.assetActionLabel = row[index][this.classifyKey]
      this.assetDialogVisible = false
    },
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
    getAsset(val) {
      if (!val) return false
      const params = {
        classify_id: val,
        search: this.searchInfo.search,
        page: this.pageQuerylist.page,
        size: 5
      }
      assetApi.list(params).then(res => {
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
        if (tableObj.fields[key]['guid']) {
          this.classifyKey = key
        }
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
    getClassify() {
      masterApi.classify().then(res => {
        this.classifyList = res.data
      })
    },
    assetClickFunc() {
      this.assetDialogVisible = true
    },
    assetHandleClose() {
      this.assetDialogVisible = false
    },
    confirmAddEnvvarsTag() {
      if (!this.labelKey || !this.labelValue) {
        this.$message({
          message: '键值都不能为空',
          type: 'warning'
        })
      } else {
        this.addFormData.extend_labels[this.labelKey] = this.labelValue
        this.labelKey = ''
        this.labelValue = ''
      }
    },
    confirmDeleteEnvvarsTag() {
      if (!this.labelKey) {
        this.$message({
          message: '删除键，键的 key 不能为空。',
          type: 'warning'
        })
      } else {
        if (!this.addFormData.extend_labels[this.labelKey]) {
          this.$message({
            message: `指定的键不存在，${this.labelKey}`,
            type: 'warning'
          })
        } else {
          delete this.addFormData.extend_labels[this.labelKey]
          this.labelKey = ''
          this.labelValue = ''
        }
      }
    },
    GetGroup() {
      groupApi.list().then(res => {
        this.groupList = res.data
      })
    },
    GetLevel() {
      LevelApi.list().then(res => {
        this.levelList = res.data
      })
    },
    closeForm(formName) {
      this.assetActionLabel = ''
      this.assetDialogVisible = false
      this.drawerFileList = []
      this.isVisibleShow = false
      this.$refs['addFormData'].resetFields()
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
    },
    updateFormData() {
      this.$confirm('正在更新, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.patch(this.addFormData.id, this.addFormData).then((request) => {
          this.$notify({
            title: '成功',
            message: '更新成功!',
            type: 'success',
            duration: 2000
          })
          this.closeForm('addFormData')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消创建'
        })
      })
    },
    createFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('正在新建, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.addFormData).then((request) => {
              this.$notify({
                title: '成功',
                message: '创建成功!',
                type: 'success',
                duration: 2000
              })
              this.closeForm('addFormData')
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消创建'
            })
          })
        } else {
          this.$message.error('提交错误，请按规定进行填写')
          return false
        }
      })
    },
    resetFormData(formName) {
      this.$refs[formName].resetFields()
      this.addFormData = JSON.parse(JSON.stringify(defaultgroupAddRowData))

      // this.$emit('update:isShow', false)
    },
    addData() {
      this.addDialogFormVisible = true
    },
    getSearchData() {
      this.pageQuerylist.page = 1
      this.getSearchDataVal()
    },
    getSearchDataVal(val) {
      if (!val) return false
      const params = {
        classify_id: val,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.dataList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getSearchDataVal(this.classifyId)
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.getAsset(this.classifyId)
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

::v-deep .el-dialog__body {
  flex: 1;
  overflow: auto;
}

/*::v-deep .el-table .cell {*/
/*  white-space: nowrap;*/
/*  overflow: hidden;*/
/*  text-overflow: ellipsis;*/
/*}*/
</style>
