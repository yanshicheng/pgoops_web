<template>
  <el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix">
      <span>部门管理</span>
    </div>
    <div class="filter-container">
      <el-input
        v-model="pageQuerylist.search_content"
        clearable
        placeholder="请输入搜索内容"
        class="input-with-select"
        style="width: 500px"
        @keyup.enter.native="searchFilter"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchFilter" />
      </el-input>
      <el-button
        icon="el-icon-edit"
        class="el-button filter-item el-button--primary"
        style="margin-left: 10px;height: 35px"
        type="primary"
        @click="handleCreate"
      >
        新建
      </el-button>
    </div>
    <div class="text item">
      <el-table
        :data="QueryUserInfo"
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
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="180">
          <template slot-scope="{row,$index}">
            <el-button size="mini" type="primary" @click="handleFormVisible(row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" :model="tempData" label-width="80px" :rules="fordata">
        <el-form-item label="名称 " prop="name">
          <el-input v-model="tempData.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDownFormVisible()">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑信息" :visible.sync="dialogFormVisibleUp" :close-on-click-modal="false">
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="info">
            <el-form ref="formup" :model="tempData" label-width="80px" :rules="fordata" style="height: 200px">
              <el-form-item label="名称 " prop="name" style="width: 60%">
                <el-input v-model="tempData.name" />
              </el-form-item>

            </el-form>
            <div class="dialog-footer" style="margin-left: 70%; ">
              <el-button @click="handleDownFormVisible()">取 消</el-button>
              <el-button type="primary" @click="updateData">确 定</el-button>
            </div>

          </el-tab-pane>
          <el-tab-pane label="添加用户" name="second">
            <template>
              <el-table

                :data="bindValue"
                style="width: 100%"
              >

                <el-table-column
                  label="序号"
                  type="index"
                  width="80"
                />
                <el-table-column
                  prop="username"
                  label="登录名"
                  width="180"
                />
                <el-table-column
                  prop="name"
                  label="姓名"
                  width="180"
                />
                <el-table-column
                  prop="address"
                  label="地址"
                />
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>

  </el-card>

</template>

<script>
import { Department as masterApi } from '@/api/user'

export default {
  name: 'PersonalCentre',
  data() {
    return {
      bindValue: [],
      bindData: [],
      activeName: 'info',
      fordata: {
        name: [{ required: true, message: '用户名必填', trigger: 'blur' }]
      },
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search_content: ''
      },
      QueryUserInfo: [],
      dialogFormVisible: false,
      dialogFormVisibleUp: false,
      textMap: {
        update: '更新信息',
        create: '创建部门'
      },
      tempData: {},
      dialogStatus: 'create'
    }
  },
  created() {
    this.GetList()
  },
  methods: {
    searchFilter() {
      this.pageQuerylist.page = 1
      this.GetList()
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.GetList()
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.GetList()
    },
    GetList() {
      masterApi.list({
        search: this.pageQuerylist.search_content,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.QueryUserInfo = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    handleFormVisible(row) {
      this.bindValue = []
      masterApi.get(
        row.id
      ).then((response) => {
        this.bindValue = response.data.user
      })
      this.tempData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.dialogFormVisibleUp = true
    },
    createData() {
      masterApi.create({
        name: this.tempData.name,
        count: this.tempData.count
      }).then((request) => {
        this.dialogFormVisible = false
        this.GetList()
        this.$notify({
          title: '成功',
          message: '创建数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      var jsonParams = {
        name: this.tempData.name
      }
      masterApi.update(this.tempData.id, jsonParams).then(() => {
        this.GetList()
        this.tempData = {}
        this.dialogFormVisible = false
        this.dialogFormVisibleUp = false
        this.$notify({
          title: '成功',
          message: '更新数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCreate() {
      this.tempData = {}
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleDownFormVisible() {
      this.dialogFormVisible = false
      this.dialogFormVisibleUp = false
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(row.id).then(() => {
          this.GetList()
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
    }
  }
}
</script>

<style scoped>

</style>
