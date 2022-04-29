<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div>
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="Alert主机">
            <el-select v-model="searchInfo.alert_host_id" clearable placeholder="请选择">
              <el-option
                v-for="item in alertList"
                :key="item.id"
                :label="item.hostname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="告警级别">
            <el-select v-model="searchInfo.severity" clearable placeholder="请选择">
              <el-option
                v-for="(item) in severityList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="告警状态">
            <el-select v-model="searchInfo.status" clearable placeholder="请选择">
              <el-option
                v-for="(item) in statusDic"

                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模糊搜索">
            <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容" />
          </el-form-item>

          <el-form-item style="float:right ">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 10px" shadow="hover">
      <div style="margin-bottom: 20px">
        <el-button @click="toggleSelection()">清空选择</el-button>
        <el-button type="danger" @click="onDelete">删除选择</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="alertHistoryDataList"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
        />
        <el-table-column
          prop="prometheus"
          label="prometheus"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="alert_host_hostname"
          label="alert_host"
          align="center"
        />
        <el-table-column
          prop="instance"
          label="实例"
          align="center"
        />
        <el-table-column
          prop="alert_name"
          label="告警名称"
          align="center"
        />
        <el-table-column
          prop="severity"
          label="告警级别"
          align="center"
        />
        <el-table-column
          prop="status"
          label="告警状态"
          align="center"
        />
        <el-table-column
          prop="start_time"
          label="开始时间"
          align="center"
        />
        <el-table-column
          prop="end_time"
          label="结束时间"
          align="center"
        />
        <el-table-column
          prop="duration"
          label="持续时间"
          align="center"
        />
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="detailButton(row)">
              详情
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
    </el-card>

  </div>

</template>

<script>
import { AlertHistory as masterApi } from '@/api/alert'
import { AlertHost } from '@/api/alert'
export default {
  name: 'Index',
  data() {
    return {
      alertList: '',
      alertHistoryDataList: [],
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      statusDic: [{ id: 1, name: 'firing' }, { id: 2, name: 'resolved' }],
      severityList: ['warning', 'critical', 'emergency'],
      searchInfo: {
        alert_host_id: '',
        severity: '',
        status: ''
      },
      multipleSelection: []
    }
  },
  created() {
    this.GetList()
    this.GetAlert()
  },
  methods: {
    detailButton(row) {
      this.$router.push({ name: 'AlertHistoryDetail', query: { id: row.id }})
    },
    onDelete() {
      const params = { list_id: this.multipleSelection }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.deldata(params).then(() => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除！'
        })
      })
    },
    GetAlert() {
      AlertHost.list().then(response => {
        this.alertList = response.data.result ? response.data.result : response.data
      })
    },
    GetList() {
      masterApi.list({
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.alertHistoryDataList = response.data.result ? response.data.result : response.data
        this.pageQuerylist.total = response.data.count
      })
    },
    onReset() {
      this.searchInfo = {}
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (var key in val) {
        this.multipleSelection.push(Number(val[key]['id']))
      }
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
    searchData() {
      const params = {
        search: this.searchInfo.search,
        status: this.searchInfo.status,
        severity: this.searchInfo.severity,
        alert_name_id: this.searchInfo.alert_host_id,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      masterApi.list(params).then((res) => {
        this.alertHistoryDataList = res.data.result ? res.data.result : res.data
        this.pageQuerylist.total = res.data.count
      })
    }
  }
}
</script>

<style scoped>

</style>
