<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>通告详情</span>
    </div>
    <div class="text item">
      <el-descriptions title="基本信息" border :column="4" direction="vertical">
        <el-descriptions-item label="应  用">{{ taskInfoData.app_name }}</el-descriptions-item>
        <el-descriptions-item label="通告主题">{{ taskInfoData.name }}</el-descriptions-item>
        <el-descriptions-item label="通告类型">{{ taskInfoData.type_name }}</el-descriptions-item>
        <el-descriptions-item label="通告级别">{{ taskInfoData.level_name }}</el-descriptions-item>
        <el-descriptions-item label="通告创建时间">{{ taskInfoData.created_at }}</el-descriptions-item>
        <el-descriptions-item label="通告结束时间">{{ taskInfoData.updated_at }}</el-descriptions-item>
        <el-descriptions-item label="通知用户">{{ taskInfoData.user_name }}</el-descriptions-item>
        <el-descriptions-item label="是否通知全员">{{ taskInfoData.is_all }}</el-descriptions-item>
        <el-descriptions-item label="发送状态" :span="4">{{ taskInfoData.status }}</el-descriptions-item>

        <el-descriptions-item label="发送错误信息" :span="4">{{ taskInfoData.output_err }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="通知信息详情" direction="vertical" :column="4" border style="margin-top: 30px">
        <el-descriptions-item label="实例地址">{{ taskInfoData.instance }}</el-descriptions-item>
        <el-descriptions-item label="概要信息" :span="3">{{ taskInfoData.start_at }}</el-descriptions-item>
        <el-descriptions-item label="重复次数">{{ taskInfoData.summary }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ taskInfoData.start_at }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ taskInfoData.end_at }}</el-descriptions-item>
        <el-descriptions-item label="持续时间">{{ taskInfoData.duration }}</el-descriptions-item>
        <el-descriptions-item label="扩展信息" :span="4">{{ taskInfoData.labels }}</el-descriptions-item>
        <el-descriptions-item label="告警详情" :span="4">{{ taskInfoData.description }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>

</template>

<script>
import { History as masterApi } from '@/api/message-center' // 引入控制主题，没有的话主题不起效果
// import { codemirror } from 'vue-codemirror'

export default {
  name: 'Detail',
  // components: {
  //   codemirror
  // },
  data() {
    return {
      taskInfoData: {}
    }
  },

  created() {
    this.GetList(this.$route.query.id)
  },
  mounted() {
    // 高亮渲染
  },
  methods: {

    GetList(id) {
      masterApi.get(id).then(response => {
        this.taskInfoData = response.data.result ? response.data.result : response.data
      })
    }
  }
}
</script>

<style scoped>
pre {
  position: relative;
}

.pre-numbering {
  position: absolute;
  top: 0;
  left: -30px;
  width: 30px;
  border-right: 1px solid #C3CCD0;
  background-color: #012ce3;
  text-align: center;
  padding: 0.5em 0;
}

.pre-numbering li {
  list-style: none;
  color: #AAA;
  font-size: 1em;
}

.codemirror {
  overscroll-y: scroll !important;
  height: auto !important;
}

.title {
  font-size: 44px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #303133;
  padding-bottom: 17px;
  padding-top: 17px;
}

p {
  margin: 0;
  padding: 0;
}

.row {
  overflow: hidden;
  margin-bottom: 22px;
}

.row .col_left {
  float: left;
  width: 420px;
}

.row .col_right {
  float: left;
}
</style>
