<template>
  <div class="assets-center-container">
    <div class="meta" />
    <div class="assets-center-container">
      <template v-if="key_list.length">
        <div class="filter-container">
          <el-input
            v-model="pageQuerylist.search_content"
            clearable
            placeholder="请输入搜索内容"
            class="input-with-select"
            style="width: 500px"
            @keyup.enter.native="searchFilter"
          />
          <el-button icon="el-icon-search" type="primary" style="margin-left: 10px" @click="searchFilter">搜索</el-button>

        </div>
        <div class="text item">
          <el-table
            :data="key_list"
            border
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
              width="80"
            />

            <el-table-column
              label="名称"
              align="center"
              prop="name"
            />
            <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="360">
              <template slot-scope="{row}">
                <el-button size="mini" type="success" @click="testFormVisible(row)">
                  测试
                </el-button>
                <el-button size="mini" type="primary" @click="viewFormVisible(row)">
                  指纹
                </el-button>
                <el-button size="mini" type="warning" @click="rejectFormVisible(row)">
                  拒绝
                </el-button>
                <el-button size="mini" type="danger" @click="deleteFormVisible(row)">
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
        <el-dialog
          title="指纹"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="35%"
        >
          <span>{{ finger }}</span>

        </el-dialog>
      </template>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>

</template>

<script>
import { TaskKeys as masterApi } from '@/api/task'

export default {
  name: 'Accept',
  data() {
    return {
      finger: '',
      dialogVisible: false,
      key_list: [],
      menuSize: 'mini',
      loading: false,
      currentNode: {},
      activeName: '1',
      activeTabs: 'info',
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
    this.getList()
  },
  methods: {
    // 测试函数
    testFormVisible(val) {
      const parems = { minion: val.name }
      masterApi.testpost(parems).then((res) => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '测试成功',
          type: 'success'
        })
      })
    },
    // 查看 key 函数
    viewFormVisible(val) {
      const parems = { minion: val.name }
      masterApi.fingerpost(parems).then((res) => {
        this.finger = res.data.finger
        this.dialogVisible = true
      })
    },
    // 注销 key 函数
    rejectFormVisible(val) {
      const parems = { minion: val.name }
      this.$confirm('是否移除 minion key， 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delreject(parems).then((res) => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '移除成功，您可在已拒绝区进行恢复此 minion key！',
            type: 'success'
          })
        })
      })
    },
    // 删除 key 函数
    deleteFormVisible(val) {
      const parems = { minion: val.name }
      this.$confirm('是否删除 minion key，此操作不可逆。 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delkey(parems).then((res) => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleCreate(val) {
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
    // 获取 key 列表
    getList() {
      masterApi.list(this.pageQuerylist).then(res => {
        this.key_list = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
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
    handleNodeClick(data) {
      this.activeName = '1'
      this.currentNode = data
    },
    handleContextMenu(data) {
      this.currentNode = data
    },
    handleTabClick(data) {
      this.activeName = data.name
    }
  }
}
</script>

<style scoped>

</style>
