<template>
  <el-row>
    <el-col :span="6"><div class="grid-content bg-purple">
      <el-card class="box-card" style="margin: 10px">
        <div slot="header" class="clearfix">
          <span>文本树</span>
        </div>
        <div class="text item">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        </div>
      </el-card>

    </div></el-col>
    <el-col :span="18"><div class="grid-content bg-purple-light">
      <el-card class="box-card" style="margin: 10px">
        <div slot="header" class="clearfix">
          <span>代码展示区</span>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          {{ '列表内容 ' + o }}
        </div>
      </el-card>

    </div></el-col>
  </el-row>

</template>
<script>
import { REPOSITORY as masterApi } from '@/api/iac'

export default {
  name: 'Detail',
  data() {
    return {
      alertHistoryInfo: '',
      dataList: '',
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    if (!this.$route.query.id) return false
    this.GetList(this.$route.query.id)
  },
  methods: {
    GetList(id) {
      masterApi.get(id).then(response => {
        this.dataList = response.data.result ? response.data.result : response.data
      })
    }
  }
}

</script>

<style scoped>

</style>
