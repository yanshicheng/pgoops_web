<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <div class="login-container-form">
          <img :src="logoImg" width="350px" height="50px" alt="Girl has dropped her ice cream.">
          <!--          <div class="title">欢迎登录!</div>-->
          <!--          <div class="title-tips">Super Ops平台！</div>-->
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
          >

            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="username" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="UserName"
                tabindex="1"
              />
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>

            <!--            <el-form-item prop="password">-->
            <!--              <span class="svg-container">-->
            <!--                <svg-icon icon-class="password"/>-->
            <!--              </span>-->
            <!--              <el-input-->
            <!--                v-model="loginForm.password"-->
            <!--                ref="password"-->
            <!--                :type="passwordType">-->
            <!--              </el-input>-->
            <!--              <span class="show-pwd" @click="showPwd">-->
            <!--                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>-->
            <!--              </span>-->
            <!--              />-->

            <!--            </el-form-item>-->
            <!--      </el-tooltip>-->
            <el-form-item>
              <el-button
                :loading="loading"
                style="width:100%;margin-bottom:20px; margin-top: 0px"
                type="primary"
                @click.native.prevent="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>

            <!--          <router-link to="/register">-->
            <!--            <div style="margin-top: 20px">注册</div>-->
            <!--          </router-link>-->
          </el-form>
          <div class="session-login-oauth">
            <div class="session-login-oauth__container">
              <div class="field">
                <div class="ui horizontal divider session-login__oauth-title">
                  <span class="text-muted">其他方式登录</span>
                </div>
              </div>
              <div class="ui horizontal list session-oauth__list">
                <div class="item">
                  <a @click="denglu">
                    <div class="git-other-login-icon">
                      <svg-icon icon-class="dingding" />

                    </div>
                  </a>
                </div>
                <!--                <div>-->
                <!--                  <span class="text-muted" style="font-size: 15px; margin-left: 20px">测试账户</span>-->
                <!--                  <div class="text-muted" style="font-size: 15px; margin-left: 20px">管理员: super 密码: super</div>-->
                <!--                  <span class="text-muted" style="font-size: 15px;margin-left: 30px">普通用户: edit 普通用户: edit</span>-->
                <!--                </div>-->
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="bottom-info" style="padding: 16px 0px; bottom: 25px;left: 50%;margin-left:-237px ;position: fixed; ">
      <div>
        <a target="_blank" href="http://www.pgoops.com" class="ele-text-secondary" style="margin-left: 5px"> 官网 </a>
        <em />
        <a target="_blank" href="http://www.pgoops.com" class="ele-text-secondary" style="margin-left: 5px"> 文档 </a>
        <em />
        <a target="_blank" href="https://gitee.com/pgoops/" class="ele-text-secondary" style="margin-left: 5px"> gitee </a>
      </div>
      <div class="ele-text-secondary" style="margin-top: 8px;">
        <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index" class="ele-text-secondary" style="margin-left: 5px"> 京ICP备16013810号 </a>
        Copyright © 2019~2022 pgoops自动化运维平台
      </div>
    </div>
  </div>

</template>

<script>
import logoImg from '@/assets/images/pgo_logo.svg'

export default {
  name: 'Login',
  data() {
    // const validatePassword = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('密码不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      logoImg: logoImg,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度应该在3-20字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 26, message: '密码长度应该在4-26字符之间', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.notice()
    // prompt()
    // window.addEventListener('storage', this.afterQRScan)
  },

  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    notice() {
      this.$message({
        showClose: true,
        dangerouslyUseHTMLString: true,
        duration: 10000,
        message: '<div><span style="font-weight: bold;">管理用户 :</span> <span style="font-weight: bold;">super</span><span style="font-weight: bold;margin-left: 10px">密码 :</span> <span style="font-weight: bold;">123456</span></div>' +
          '<div style="margin-top: 10px"><span style="font-weight: bold;">普通用户 :</span> <span style="font-weight: bold;"> edit&nbsp;&nbsp; </span><span style="font-weight: bold;margin-left: 10px">密码 :</span> <span style="font-weight: bold;">123456</span></div>' +
          '<div style="margin-top: 10px"><span style="font-weight: bold;">GitHub :</span> <span style="font-weight: bold;"> https://github.com/yanshicheng&nbsp;&nbsp; </span></div>'

      })
    },
    denglu() {
      alert('开发中')
    },
    // prompt() {
    //   alert('动态权限测试账户管理员: super  密码: super 普通用户: edit 密码: edit')
    // },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.bottom-info {
  color: #888;
  height: 30px;
  line-height: 12px;
  a {
    color: #888;
  }
  div {
    display: flex;
    justify-content: center;
    span{
      margin: 0 3px;
    }
  }
}
.login-container {
  height: 100vh;
  background: url("~@/assets/login_images/login_background.png") center center fixed no-repeat;
  background-size: cover;

  .login-container-form {
    width: calc(100% - 120px);
    height: 500px;
    padding: 4vh;
    margin-top: calc((100vh - 440px) / 2);
    margin-right: 20px;
    margin-left: 20px;
    background: url('~@/assets/login_images/login_form.png');
    background-size: 100% 100%;
    border-radius: 10px;
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.06);
  }

  .title {
    font-size: 32px;
    color: #fff;
  }

  .title-tips {
    margin-bottom: 30px;
    font-size: 20px;
    color: #fff;
  }
  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    height: 60px;
  }
  .login-btn {
    display: inherit;
    width: 220px;
    height: 60px;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .show-pwd {
    right: -95%;
    top: -42px;
    position: relative;
  }

  .tips {
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: #1890ff;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    z-index: 999;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: 0em;
    fill: currentColor;
    overflow: hidden;
  }

  .show-password {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0 0 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;

      &__content {
        min-height: 35px;
        line-height: 35px;
      }

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: 12px;
        line-height: 18px;
        color: #ff4d4f;
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 58px;
        padding-left: 45px;
        font-size: 14px;
        line-height: 58px;
        color: #606266;
        background: #f6f4fc;
        border: 0;
        caret-color: #606266;
      }
    }

    .session-login-oauth {
      margin: 0px auto;
      display: block;
    }

    .session-login-oauth__container {
      margin-top: 0px;
      text-align: center;
    }

    .ui.horizontal.session-login__oauth-title {
      font-weight: normal;
    }

    .ui.horizontal.divider {
      display: table;
      white-space: nowrap;
      height: auto;
      margin: 1px;
      line-height: 1;
      text-align: center;
    }

    .ui.divider {
      font-size: 1rem;
    }

    .ui.divider {
      margin: 1rem 0rem;
      line-height: 1;
      height: 0em;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: rgba(0, 0, 0, 0.85);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .text-muted {
      color: #ffffff;
      background-color: #0e85de;
    }

    .ui.horizontal.list {
      display: inline-block;
      font-size: 2em;
    }

    .ui.horizontal.list > .item:first-child {
      margin-left: 0em !important;
      padding-left: 0em !important;
    }

    .ui.horizontal.divider {
      width: 100%;
      display: block;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC");
    }

    .git-other-login-icon {
      margin-top: 20px;
      float: right;
    }

    .session-oauth__list {
      display: -webkit-box !important;
      display: -ms-flexbox !important;
      display: flex !important;
      -webkit-box-pack: center !important;
      -ms-flex-pack: center !important;
      justify-content: center !important;
    }
  }
}
</style>
