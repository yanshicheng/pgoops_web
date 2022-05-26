<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="监控平台配置">
        <el-form :label-position="labelPosition" label-width="40%" :model="formLabelAlign">
          <el-form-item label="prometheus地址:">
            <el-input v-model="dataQuery.monitoring.prometheus_url" />
          </el-form-item>
          <el-form-item label="alertmanager地址:">
            <el-input v-model="dataQuery.monitoring.alertmanager_url" />
          </el-form-item>
          <el-form-item label="grafana地址:">
            <el-input v-model="dataQuery.monitoring.grafana_url" />
          </el-form-item>
          <el-form-item label="总 Node_export uri:">
            <el-input v-model="dataQuery.monitoring.grafana_all_node_uri" />
          </el-form-item>
          <el-form-item label="Node_export uri:">
            <el-input v-model="dataQuery.monitoring.grafana_node_uri" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="position:absolute; margin-top: 10px; transform: translate(-30%,-30%);left: 20%;top: 30%"
              @click="updateBtn('monitoring')"
            >提交
            </el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="告警媒介配置">
        <el-form :label-position="labelPosition" label-width="15%" :model="formLabelAlign">
          <diV class="tablemanage-container">
            <div class="type-header">
              <h3 class="title">微信</h3>
              <el-form-item label="DingTalk WebHook:">
                <el-input v-model="dataQuery.alert_provider.dingtalk_webhook" />
              </el-form-item>
            </div>
            <div class="type-header">
              <h3 class="title">钉钉</h3>
              <el-form-item label="DingTalk 密钥:">
                <el-input v-model="dataQuery.alert_provider.dingtalk_secret" type="password" show-password />
              </el-form-item>
              <el-form-item label="Wechat WebHook:">
                <el-input v-model="dataQuery.alert_provider.wechat_webhook" />
              </el-form-item>
            </div>
            <div class="type-header">
              <h3 class="title">飞书</h3>
              <el-form-item label="Lark WebHook:">
                <el-input v-model="dataQuery.alert_provider.lark_webhook" />
              </el-form-item>
              <el-form-item label="Lark Secret:">
                <el-input v-model="dataQuery.alert_provider.lark_secret" type="password" show-password />
              </el-form-item>
              <el-form-item label="Lark App Id:">
                <el-input v-model="dataQuery.alert_provider.lark_app_id" type="password" show-password />
              </el-form-item>
              <el-form-item label="'Lark App Secret:">
                <el-input v-model="dataQuery.alert_provider.lark_app_secret" type="password" show-password />
              </el-form-item>
            </div>
            <div class="type-header">
              <h3 class="title">邮件</h3>
              <el-form-item label="Email SMTP 地址:">
                <el-input v-model="dataQuery.alert_provider.email_smtp_host" />
              </el-form-item>
              <el-form-item label="Email SMTP 端口:">
                <el-input v-model="dataQuery.alert_provider.email_smtp_port" />
              </el-form-item>
              <el-form-item label="Email 发件邮箱:">
                <el-input v-model="dataQuery.alert_provider.email_msg_from" />
              </el-form-item>
              <el-form-item label="Email 密钥:">
                <el-input v-model="dataQuery.alert_provider.email_secret" type="password" show-password />
              </el-form-item>
              <el-form-item label="Email 标识域名:">
                <el-input v-model="dataQuery.alert_provider.email_domain_name" />
              </el-form-item>
            </div>
          </diV>
          <el-form-item>
            <!--            style="position:absolute; margin-top: 10px; transform: translate(-30%,-30%);left: 20%;top: 30%"-->
            <el-button
              type="primary"
              @click="updateBtn('alert_provider')"
            >提交
            </el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { Config as masterApi } from '@/api/settings'

export default {
  name: 'Index',
  data() {
    return {
      labelPosition: 'right',
      dataQuery: {
        monitoring: {
          prometheus_url: '',
          grafana_url: '',
          alertmanager_url: '',
          grafana_node_uri: '',
          grafana_all_node_uri: ''
        },
        alert_provider: {
          dingtalk_webhook: '',
          dingtalk_secret: '',
          wechat_webhook: '',
          email_smtp_host: '',
          email_smtp_port: '',
          email_msg_from: '',
          email_secret: '',
          email_domain_name: '',
          lark_webhook: '',
          lark_app_secret: '',
          lark_app_id: '',
          lark_secret: ''
        }
      },
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    }
  },
  created() {
    this.GetList()
  },
  methods: {
    GetList() {
      masterApi.get().then(response => {
        this.dataQuery = response.data
      })
    },
    updateBtn(section) {
      var params = {}
      if (section === 'alert_provider') {
        params = {
          section: 'alert.provider',
          data: this.dataQuery[section]
        }
      } else if (section === 'monitoring') {
        params = {
          section: 'monitoring',
          data: this.dataQuery[section]
        }
      } else {
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: '配置更新中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      masterApi.create(params).then(response => {
        loading.close()
        this.GetList()
        this.$notify({
          title: '成功',
          message: '数据提交成功!',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #e6ebf5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #c9c9c9;
}

::v-deep .el-input--medium {
  font-size: 14px;
  width: 400px;
}

::v-deep .el-input--medium .el-input__inner {
  height: 36px;
  line-height: 36px;
  width: 400px;
}

::v-deep .el-input--medium .el-input__icon {
  line-height: 36px;
}

.tablemanage-container {
  //padding: 24px;
  //box-sizing: border-box;

  .type-header {
    //display: flex;
    //flex-direction: row;
    //justify-content: flex-start;
    //align-items: center;
    //margin-bottom: 20px;
    //margin-top: 10px;

    .title {
      border-left: 2px solid #409EFF;
      padding-left: 4px;
      box-sizing: border-box;
      margin-right: 10px;
    }
  }
}
</style>
