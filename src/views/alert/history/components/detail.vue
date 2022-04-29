<template>
  <el-card class="box-card">
    <div class="text item">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <el-descriptions class="margin-top" title="告警详情" :column="3" :size="size" border>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user" />
                  用户名
                </template>
                kooriookami
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile-phone" />
                  手机号
                </template>
                18100000000
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-location-outline" />
                  居住地
                </template>
                苏州市
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets" />
                  备注
                </template>
                <el-tag size="small">学校</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building" />
                  联系地址
                </template>
                江苏省苏州市吴中区吴中大道 1188 号
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-descriptions class="margin-top" title="规则详情" :column="3" :size="size" border style="margin-left: 10px">
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user" />
                  用户名
                </template>
                kooriookami
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile-phone" />
                  手机号
                </template>
                18100000000
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-location-outline" />
                  居住地
                </template>
                苏州市
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets" />
                  备注
                </template>
                <el-tag size="small">学校</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building" />
                  联系地址
                </template>
                江苏省苏州市吴中区吴中大道 1188 号
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-light">
            <el-descriptions class="margin-top" title="通知详情" :column="3" :size="size" border>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user" />
                  用户名
                </template>
                kooriookami
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile-phone" />
                  手机号
                </template>
                18100000000
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-location-outline" />
                  居住地
                </template>
                苏州市
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-tickets" />
                  备注
                </template>
                <el-tag size="small">学校</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building" />
                  联系地址
                </template>
                江苏省苏州市吴中区吴中大道 1188 号
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
import { AlertHistory as masterApi } from '@/api/alert'

export default {
  name: 'Detail',
  data() {
    return {
      alertHistoryInfo: ''
    }
  },
  created() {
    if (!this.$route.query.id) return false
    this.GetList(this.$route.query.id)
  },
  methods: {
    GetList(id) {
      masterApi.get(id).then(response => {
        console.log(response)
        this.alertHistoryInfo = response.data.result ? response.data.result : response.data
      })
    }
  }
}

</script>

<style scoped>

</style>
