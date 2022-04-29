<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>用户管理</span>
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
            fixed
            label="序号"
            type="index"
            width="80"
          />

          <el-table-column
            align="center"
            label="姓名"
            prop="name"
            width="200px"
          />
          <el-table-column
            align="center"
            label="登录名"
            prop="username"
            width="200px"
          />
          <el-table-column
            align="center"
            label="邮箱"
            prop="email"
            width="200px"
          />
          <el-table-column align="center" label="超级用户">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_superuser"
                disabled
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="后台权限">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_staff"
                disabled
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_active"
                disabled
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色">
            <template slot-scope="{row}">
              <span v-for="(item, index) in row.roles" :key="index">
                <el-tag v-if="item === 'admin'" style="margin-right: 3px">{{ item }}</el-tag>
                <el-tag v-else type="warning">{{ item }}</el-tag>
              </span>

            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="部门"
            prop="dep"
          />
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" fixed="right" width="260">
            <template slot-scope="{row,$index}">

              <el-button size="mini" type="primary" @click="handlEdit(row)">
                编辑
              </el-button>
              <el-button size="mini" type="warning" @click="handlRepwd(row)">
                重置密码
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
    <el-dialog :title="repwd_title + name" :visible.sync="resetPasswordForm" width="40%" :close-on-click-modal="false">
      <el-form ref="repedRef" :model="resetPassword" :rules="repwd">
        <el-form-item label="新密码" label-width="80px" prop="new_password">
          <el-input v-model="resetPassword.new_password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="old_password">
          <el-input v-model="resetPassword.old_password" autocomplete="off" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDownFormVisible">取 消</el-button>
        <el-button type="primary" @click="postResetPassword">确 定</el-button>
      </div>

    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="createUser" :model="tempData" :rules="rules" class="el-form">
        <el-form-item label="姓名" label-width="80px" prop="name" style="width: 300px">
          <el-input v-model="tempData.name" />
        </el-form-item>
        <el-form-item label="登录名" label-width="80px" prop="name" style="width: 300px">
          <el-input v-model="tempData.username" />
        </el-form-item>
        <el-form-item label="图标" prop="icon" required>
          <input id="file" type="file" name="file" @change="getFile($event)">
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email" style="width: 300px">
          <el-input v-model="tempData.email" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码" label-width="80px" prop="password" style="width: 300px">
          <el-input v-model="tempData.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="确认密码" label-width="80px" prop="re_password" style="width: 300px">
          <el-input v-model="tempData.re_password" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色" label-width="80px" style="width: 300px">
          <el-select v-model="tempData.role" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px" prop="phone" style="width: 300px">
          <el-input v-model="tempData.phone" />
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="tempData.is_active" />
        </el-form-item>
        <el-form-item label="后台权限" label-width="80px">
          <el-switch v-model="tempData.is_staff" />
        </el-form-item>
        <el-form-item label="超级管理员" label-width="80px">
          <el-switch v-model="tempData.is_superuser" />
        </el-form-item>
        <el-form-item label="部门" label-width="80px">
          <el-select v-model="tempData.department" placeholder="选择部门">
            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <el-input v-model="tempData.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDownFormVisible()">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>

      </div>
    </el-dialog>

    <el-drawer
      :before-close="cancelForm"
      :visible.sync="dialog"
      custom-class="demo-drawer"
      direction="rtl"
      title="编辑用户"
    >
      <div class="demo-drawer__content">
        <el-form ref="editUserinfo" :model="tempData" class="el-form">
          <el-form-item label="姓名" label-width="80px">
            <el-input v-model="tempData.name" style="width: 350px" />
          </el-form-item>
          <el-form-item label="登录名" label-width="80px" prop="name">
            <el-input v-model="tempData.username" />
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px">
            <el-input v-model="tempData.email" style="width: 350px" />
          </el-form-item>
          <el-form-item label="手机号" label-width="80px">
            <el-input v-model="tempData.phone" style="width: 350px" />
          </el-form-item>
          <el-form-item label="超级管理员" label-width="100px">
            <el-switch v-model="tempData.is_superuser" />
          </el-form-item>
          <el-form-item label="角色" label-width="80px" style="width: 300px">
            <el-select v-model="tempData.role" multiple placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="80px">
            <el-switch v-model="tempData.is_active" />
          </el-form-item>
          <el-form-item label="后台权限" label-width="80px">
            <el-switch v-model="tempData.is_staff" />
          </el-form-item>
          <el-form-item label="部门" label-width="80px">
            <el-select v-model="tempData.department" placeholder="选择部门">
              <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" label-width="80px">
            <el-input v-model="tempData.remarks" style="width: 350px" type="textarea" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button style="margin-left: 20px; " @click="cancelForm">取 消</el-button>
          <el-button class="el-button el-button--primary" type="primary" @click="updateData">确 定</el-button>
        </div>
      </div>

    </el-drawer>

  </div>

</template>

<script>
import {
  Department
} from '@/api/user'

import { UserInfoO as masterApi } from '@/api/user'
import { Role } from '@/api/role'

const resetPasswordData = {
  id: '',
  new_password: '',
  re_password: ''
}
export default {
  name: 'PersonalCentre',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码长度不能小于八位.'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不一致'))
      } else if (value !== this.resetPassword.new_password) {
        callback(new Error('两次密码输入不一致请重新输入!'))
      } else {
        callback()
      }
    }
    const validateresPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不一致'))
      } else if (value !== this.tempData.password) {
        callback(new Error('两次密码输入不一致请重新输入!'))
      } else {
        callback()
      }
    }
    const validateisPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    const validateisEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {

      repwd: {
        new_password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        old_password: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      rules: {
        name: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: validateisEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        re_password: [{ required: true, trigger: 'blur', validator: validateresPassword }],
        phone: [{ required: true, trigger: 'blur', validator: validateisPhone }]
      },
      repwd_title: '修改密码: ',
      name: '',
      resetPasswordForm: false,
      resetPassword: Object.assign({}, resetPasswordData),
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      queryDatalist: [],
      dialogFormVisible: false,
      textMap: {
        update: '更新信息',
        create: '创建部门'
      },
      dialog: false,
      tempData: {
        name: '',
        username: '',
        email: '',
        phone: '',
        remarks: '',
        password: '',
        department: '',
        role: '',
        icon: '',
        is_superuser: false,
        is_active: false,
        is_staff: false
      },
      departments: [],
      role_list: [],
      dialogStatus: 'create',
      roles: []
    }
  },
  created() {
    this.GetList()
    this.GetRole()
  },
  methods: {
    GetRole() {
      Role.list().then(response => {
        this.roles = response.data
      })
    },
    getFile(event) {
      this.tempData.icon = event.target.files[0]
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
    getDepartments() {
      Department.list().then((res) => {
        this.departments = res.data.result ? res.data.result : res.data
      })
    },
    GetList() {
      masterApi.list({
        search_content: this.pageQuerylist.search_content,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.queryDatalist = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    handlEdit(row) {
      this.tempData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'update'
      this.getDepartments()
      this.dialog = true
    },
    createData() {
      this.$refs['createUser'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('name', this.tempData.name)
          formData.append('username', this.tempData.username)
          formData.append('email', this.tempData.email)
          formData.append('phone', this.tempData.phone)
          formData.append('is_superuser', this.tempData.is_superuser ? this.tempData.is_superuser : false)
          formData.append('is_active', this.tempData.is_active ? this.tempData.is_active : false)
          formData.append('is_staff', this.tempData.is_staff ? this.tempData.is_staff : false)
          formData.append('department', this.tempData.department)
          formData.append('remarks', this.tempData.remarks ? this.tempData.remarks : false)
          formData.append('password', this.tempData.password)
          formData.append('role', this.tempData.role)
          formData.append('icon', this.tempData.icon)
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          masterApi.create(formData, config).then((request) => {
            this.dialogFormVisible = false
            this.GetList()
            this.$notify({
              title: '成功',
              message: '创建数据成功!',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    updateData() {
      masterApi.update(this.tempData.id, this.tempData).then(() => {
        this.GetList()
        this.tempData = {}
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新数据成功!',
          type: 'success',
          duration: 2000
        })
        this.dialog = false
      })
    },
    handleCreate() {
      this.tempData = {}
      this.getDepartments()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleDownFormVisible() {
      this.tempData = ''
      this.dialogFormVisible = false
      this.resetPasswordForm = false
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
    },
    // 关闭抽屉
    handleClose(done) {
      if (this.loading) {
        return false
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(_ => {
        })
    },
    cancelForm() {
      this.dialog = false
    },
    handlRepwd(row) {
      this.resetPassword = Object.assign({}, resetPasswordData)
      this.resetPassword['id'] = row.id
      this.resetPasswordForm = true
      this.name = row.name
    },
    postResetPassword() {
      this.$refs['repedRef'].validate((valid) => {
        if (valid) {
          masterApi.repwd(this.resetPassword.id, this.resetPassword).then(() => {
            this.resetPasswordForm = false
            this.$notify({
              title: '成功',
              message: '密码更新成功!',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
