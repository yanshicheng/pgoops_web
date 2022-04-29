<template>
  <div>
    <el-page-header :content="'详情信息'" style="margin-bottom: 10px;" @back="goBack" />
    <div class="data-center-table">
      <div class="classify-nav">
        <p :class="{'active': currentNav === 'basicInfo'}" @click="currentNav = 'basicInfo'">基本信息</p>
        <p :class="{'active': currentNav === 'table'}" @click="currentNav = 'table'">表字段</p>
        <p :class="{'active': currentNav === 'center'}" @click="currentNav = 'center'">关系中心</p>
      </div>
      <div class="meta" />
      <div v-show="currentNav === 'basicInfo'" class="classify-container">
        <el-form ref="form" :model="form" label-width="80px" style="width: 500px; margin: auto;">
          <el-form-item label="名称">
            <span>{{ cardInfo.name }}</span>
          </el-form-item>
          <el-form-item label="别名">
            <span>{{ cardInfo.alias }}</span>
          </el-form-item>
          <el-form-item label="图标">
            <img :src="cardInfo.icon" alt="">
          </el-form-item>
          <el-form-item label="日志记录">
            <el-switch v-model="cardInfo.record_log" disabled />
          </el-form-item>
          <el-form-item label="禁止关联">
            <el-switch v-model="cardInfo.ban_bind" disabled />
          </el-form-item>
          <el-form-item label="描述">
            <span>{{ cardInfo.remark }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="currentNav === 'table'" class="classify-container">
        <TableData :edit-data="cardInfo" :is-edit="false" />
      </div>
      <div v-show="currentNav === 'center'" class="classify-container">
        <el-tag effect="plain" style="margin-bottom: 10px;">我关联的</el-tag>
        <el-table :data="cardInfo.children" border style="width: 100%">
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="parent_name" label="分类名" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="alias" label="别名" />
          <el-table-column prop="record_log" label="日志记录">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.record_log" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column prop="ban_bind" label="禁止关联">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.ban_bind" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column prop="bind_mode" label="关联模式">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.bind_mode" disabled size="mini" />
            </template>
          </el-table-column>
        </el-table>
        <el-tag effect="plain" style="margin-top: 20px;margin-bottom: 10px;">关联我的</el-tag>
        <el-table :data="cardInfo.relevant" border style="width: 100%">
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="parent_name" label="分类名" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="alias" label="别名" />
          <el-table-column prop="record_log" label="日志记录">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.record_log" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column prop="ban_bind" label="禁止关联">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.ban_bind" disabled size="mini" />
            </template>
          </el-table-column>
          <el-table-column prop="bind_mode" label="关联模式">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.bind_mode" disabled size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { Classify as masterApi } from '@/api/data-map'
import TableData from '../datacenter/TableData.vue'

export default {
  name: '',
  components: {
    TableData
  },
  data() {
    return {
      currentNav: 'basicInfo',
      form: {},
      tableData: [],
      cardInfo: {}
    }
  },
  created() {
    this.getEditCardInfo()
    this.currentNav = 'basicInfo'
  },
  methods: {
    getEditCardInfo() {
      masterApi.get(this.$route.query.pid).then(res => {
        this.cardInfo = res.data
      })
    },
    goBack() {
      this.$router.push({ name: 'CmdbClassify' })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-center-table {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
  // box-shadow: 0 0 8px 0 rgba(232,237,250,60%), 0 2px 4px 0 rgba(232,237,250,50%);
  background-color: #fff;

  .classify-nav {
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > p {
      display: inline-block;
      cursor: pointer;
    }

    .active {
      font-weight: 700;
    }
  }

  .meta {
    background-color: #fafafa;
    border-top: 1px solid #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height .2s;
  }

  .classify-container {
    padding: 24px;
    box-sizing: border-box;
  }
}
</style>
