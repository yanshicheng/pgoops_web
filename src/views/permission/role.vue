<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>角色管理</span>
      </div>
      <div class="filter-container">
        <el-input
          v-model="pageQuerylist.search"
          class="input-with-select"
          clearable
          placeholder="请输入搜索内容"
          style="width: 500px"
          @keyup.enter.native="searchFilter"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchFilter" />
        </el-input>
        <el-button
          class="el-button filter-item el-button--primary"
          icon="el-icon-edit"
          style="margin-left: 10px;height: 35px"
          type="primary"
          @click="handleCreate"
        >
          新建
        </el-button>
      </div>

      <div class="text item">
        <el-table
          :data="queryDatalist"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="80"
          />
          <el-table-column
            align="center"
            label="名称"
            prop="name"
          />
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="180">
            <template slot-scope="{row,$index}">
              <el-button size="mini" type="primary" @click="handlEdit(row)">
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
    <el-drawer
      :title="'编辑: ' + iname"
      :visible.sync="drawerFormVisible"
      :direction="direction"
      :before-close="handleClose"
      custom-class="demo-drawer"
      size="50%"
    >
      <el-tabs v-model="activeName" type="card" class="demo-drawer__content">
        <el-tab-pane label="基本信息" name="first" class="demo-drawer__content">
          <el-form :model="tempData" class="el-form">
            <el-form-item label="名称" label-width="80px" required>
              <el-input v-model="tempData.name" />
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button @click="handleDownFormVisible()">取 消</el-button>
            <el-button type="primary" @click="updateData()">确 定</el-button>
          </div>

        </el-tab-pane>

        <el-tab-pane label="用户管理" name="second">
          <div style="margin: 20px">
            <el-transfer
              v-model="ferValue"
              :data="ferData"
              @change="handleChange"
            />

          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <el-dialog title="新增角色" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="dialogData" class="el-form">
        <el-form-item label="名称" label-width="80px" required>
          <el-input v-model="dialogData.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDownFormVisible()">取 消</el-button>
        <el-button type="primary" @click="createData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { UserInfoO } from '@/api/user'
import { Role as masterApi } from '@/api/role'

const defaultRole = {
  title: '',
  remarks: '',
  menus: [],
  permissions: []
}
export default {
  name: 'PermissionRoles',
  data() {
    return {
      ferValue: [],
      dialogData: {},
      dialogFormVisible: false,
      iname: '',
      ferData: [],
      activeName: 'first',
      drawer: false,
      direction: 'rtl',
      permissionFilter: '',
      menuFilter: '',
      checkStrictly: false,
      dialogStatus: 'create',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      permissionData: [],
      menusData: [],
      rules: {
        title: [{ required: true, message: '名称必填', trigger: 'blur' }]
      },
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      queryDatalist: [],
      drawerFormVisible: false,
      textMap: {
        update: '更新信息',
        create: '创建角色'
      },
      tempData: Object.assign({}, defaultRole),
      departments: []
    }
  },
  watch: {
    permissionFilter(val) {
      this.$refs.permissionTree.filter(val)
    },
    menuFilter(val) {
      this.$refs.menusTree.filter(val)
    }
  },
  created() {
    this.GetList()
    this.getUserInfo()
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        var infoJson = {
          user_list: movedKeys,
          role_id: this.tempData.id
        }
        masterApi.bind_user(infoJson).then((request) => {
          this.$notify({
            title: '新增成功',
            message: '添加用户成功!',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        var rinfoJson = {
          user_list: movedKeys,
          role_id: this.tempData.id
        }
        masterApi.un_bind(rinfoJson).then((request) => {
          this.$notify({
            title: '移除用户成功',
            message: '移除用户成功!',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    getUserInfo() {
      UserInfoO.list().then((request) => {
        request.data.forEach((inc, index) => {
          this.ferData.push({
            label: inc.username,
            key: inc.id
          })
        })
      })
    },
    permissionFilterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    menusFilterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    handlePermissionCheckChange(data, checked, indeterminate) {
      this.tempData.permissions = this.$refs.permissionTree.getCheckedKeys()
    },
    handleMenusCheckChange(data, checked, indeterminate) {
      this.tempData.menus = this.$refs.menusTree.getCheckedKeys()
    },
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
        search_content: this.pageQuerylist.search_content,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.queryDatalist = response.data
        this.pageQuerylist.total = response.count
      })
    },
    handlEdit(row) {
      this.ferValue = []
      masterApi.get(row.id).then((request) => {
        request.data.user.forEach((inc, index) => {
          this.ferValue.push(inc.id)
        })
      })
      this.iname = row.name
      this.tempData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(row.permissions)
        this.$refs.menusTree.setCheckedKeys(row.menus)
      })
      this.dialogStatus = 'update'
      this.drawerFormVisible = true
    },
    createData() {
      var jsonParams = {
        name: this.dialogData.name
      }
      masterApi.create(jsonParams).then((request) => {
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
      masterApi.patch(this.tempData.id, jsonParams).then(() => {
        this.GetList()
        this.tempData = {}
        this.dialogData = {}
        this.drawerFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleDownFormVisible() {
      this.tempData = {}
      this.dialogData = {}
      this.dialogFormVisible = false
      this.drawerFormVisible = false
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
    // 关闭抽屉
  }
}
</script>

<style scoped>

</style>
