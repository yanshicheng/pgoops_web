<template>
  <el-row>
    <el-col :span="8">
      <el-card class="box-card" shadow="hover">
        <!--        <div slot="header" class="clearfix">-->
        <!--          <span>信息展示</span>-->
        <!--        </div>-->
        <div style="text-align: center;">
          <span
            class="el-avatar el-avatar--circle"
            data-v-38faac93=""
            style="height: 100px; width: 100px; line-height: 100px;text-align: center;"
          ><img
            :src="QueryUserInfo.icon"
            style="object-fit: cover;"
          ></span>
          <div
            style="margin-top: 15px;
    font-size: 24px;
    font-weight: 500;
    color: #262626;"
          > {{ QueryUserInfo.name }}
          </div>
        </div>
        <div class="text item">
          <ul style="list-style-type:none; ">
            <li style="margin-top: 10px">登录名: {{ QueryUserInfo.username }}</li>
            <li style="margin-top: 10px">邮 箱: {{ QueryUserInfo.email }}</li>
            <li style="margin-top: 10px">手机号: {{ QueryUserInfo.phone }}</li>
            <li style="margin-top: 10px">部 门:
              <el-tag v-if="QueryUserInfo.dep" type="success">{{ QueryUserInfo.dep }}</el-tag>
            </li>
            <li style="margin-top: 10px">角 色:
              <el-tag v-for="role in QueryUserInfo.roles" :key="role.id" style="margin:2px">{{ role }}</el-tag>
            </li>

          </ul>
        </div>
      </el-card>
    </el-col>

    <el-col :span="15" style="margin-left: 10px">
      <el-card class="box-card" shadow="hover">
        <el-tabs tab-position="left">
          <el-tab-pane label="用户管理">
            <el-form
              :model="QueryUserInfo"
              class="infinite-list"
              label-position="right"
              label-width="80px"
              style="line-height: 32px;"
              :rules="userInfoRules"
            >
              <el-form-item label="姓名" required>
                <el-input v-model="reQueryUserInfo.name" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="reQueryUserInfo.email" />
              </el-form-item>
              <el-form-item label="手机号" required>
                <el-input v-model="reQueryUserInfo.phone" />
              </el-form-item>
              <el-form-item label="图标" prop="icon" required>
                <input id="file" type="file" name="file" @change="getFile($event)">
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="reQueryUserInfo.remarks" type="textarea" />
              </el-form-item>
            </el-form>
            <el-button style="margin-top: 10px; float: right" type="primary" @click="handleUpdate">提交</el-button>
          </el-tab-pane>
          <el-tab-pane label="重置密码">
            <el-form
              :model="password"
              :rules="pwdRules"
              class="infinite-list"
              label-position="right"
              label-width="80px"
              style="line-height: 32px;"
            >
              <el-form-item label="原密码" prop="old_password">
                <el-input v-model="password.old_password" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="new_password">
                <el-input v-model="password.new_password" show-password />
              </el-form-item>
              <el-form-item label="确认密码" prop="renew_password">
                <el-input v-model="password.renew_password" show-password />
              </el-form-item>
            </el-form>
            <el-button style="margin-top: 10px; float: right" type="primary" @click="changePassword">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import {
  UserInfoO
} from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'PersonalCentre',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('新密码长度不能少于8位!'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码输入过短请重新输入!'))
      } else if (value !== this.password.new_password) {
        callback(new Error('两次密码输入不一致请重新输入!'))
      } else {
        callback()
      }
    }
    return {
      password: {
        old_password: '',
        new_password: '',
        renew_password: ''
      },
      reQueryUserInfo: {},
      QueryUserInfo: {},
      pwdRules: {
        old_password: [{ required: true, message: '原密码必填', trigger: 'blur' }],
        new_password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        renew_password: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      userInfoRules: {
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }],
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'username',
      'user_id',
      'roles',
      'icon'
    ])
  },
  created() {
    this.getList()
  },

  methods: {
    getFile(event) {
      this.reQueryUserInfo.icon = event.target.files[0]
    },
    getList() {
      UserInfoO.get(this.user_id).then(response => {
        this.QueryUserInfo = Object.assign({}, response.data)
        this.reQueryUserInfo = response.data
      })
    },
    changePassword() {
      var JsonData = {
        new_password: this.password.new_password,
        old_password: this.password.old_password,
        username: this.QueryUserInfo.username
      }
      UserInfoO.change_password(this.QueryUserInfo.id, JsonData).then((request) => {
        this.$notify({
          title: '成功',
          message: '密码修改成功!',
          type: 'success',
          duration: 2000
        })
        this.password = ''
      })
    },
    handleUpdate() {
      const formData = new FormData()
      formData.append('name', this.reQueryUserInfo.name)
      formData.append('email', this.reQueryUserInfo.email)
      formData.append('phone', this.reQueryUserInfo.phone)
      formData.append('remarks', this.reQueryUserInfo.remarks)
      formData.append('icon', this.reQueryUserInfo.icon)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      UserInfoO.patch(this.QueryUserInfo.id, formData, config).then((request) => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '修改信息成功!',
          type: 'success',
          duration: 2000
        })
      })
    }

  }

}
</script>

<style scoped>

</style>
