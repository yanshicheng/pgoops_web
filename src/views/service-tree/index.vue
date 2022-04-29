<template>
  <div class="service-tree">
    <div class="list-main">
      <NavTree @handleNodeClick="handleNodeClick" @handleContextMenu="handleContextMenu" />
      <div class="table-container">
        <div class="tables">
          <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane name="1" label="节点详情">
              <SectionDetail v-if="activeName=='1'" :nodes="currentNode" />
            </el-tab-pane>
            <el-tab-pane name="2" label="节点权限">
              <AuthManage v-if="activeName=='2'" :nodes="currentNode" />
            </el-tab-pane>
            <el-tab-pane name="3" label="节点大盘"><h1>待开发</h1></el-tab-pane>
            <el-tab-pane name="4" label="资产中心">
              <CMDBManage v-if="activeName=='4'" :nodes="currentNode" />
            </el-tab-pane>
            <el-tab-pane name="5" label="作业平台">
              <h1>待开发</h1>
            </el-tab-pane>
            <el-tab-pane name="6" label="监控配置"><h1>待开发</h1></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavTree from './components/NavTree.vue'
import SectionDetail from './components/SectionDetail.vue'
import AuthManage from './components/AuthManage.vue'
import CMDBManage from './components/cmdb/index.vue'
import lockPic from '@/assets/images/lock.svg'

export default {
  name: '',
  components: {
    NavTree,
    SectionDetail,
    AuthManage,
    CMDBManage
  },
  data() {
    return {
      menuSize: 'mini',
      loading: false,
      currentNode: {},
      activeName: '1',
      activeTabs: 'info',
      lockPic
    }
  },
  provide() {
    return {
      serviceTree: this
    }
  },
  created() {
  },
  methods: {
    handleNodeClick(data) {
      this.activeName = '1'
      this.currentNode = data
    },
    handleContextMenu(data) {
      this.currentNode = data
    },
    handleTabClick(data) {
      this.activeName = data.name
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tag {
  margin-right: 5px;
}

.list-main {
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  .table-container {
    width: calc(100% - 320px);
    background-color: #fff;
    height: 100%;
    padding: 12px 0;

    .table-header {
      height: 52px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .tables {
      padding: 0 20px 10px;
      box-sizing: border-box;
    }
  }
}
</style>
