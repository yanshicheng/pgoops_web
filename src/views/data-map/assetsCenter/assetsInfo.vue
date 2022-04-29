<template>
  <div class="assets-center-container">
    <div class="assets-center-operate">
      <el-button type="primary" plain @click="addNewType('')">新增分类</el-button>
      <el-input
        v-model="search"
        prefix-icon="el-icon-search"
        placeholder="请输入内容"
        style="width: 200px; margin-left:10px;"
        @keyup.enter="fetchTableClassifyTree"
      />
    </div>
    <div class="meta" />
    <div class="assets-center-container" />
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
::v-deep .el-table th {
  text-align: center;
  font-weight: bold;
  color: #606266;
  background-color: #EBEEF5;
}

::v-deep .el-table--border, .el-table--group {
  border: 1px solid #DCDFE6;
}

::v-deep .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid #DCDFE6;
}

::v-deep .el-table td, .el-table th.is-leaf {
  border-bottom: 1px solid #DCDFE6;
}

::v-deep .el-table .el-table__header-wrapper .el-table__header th.is-leaf {
  border-bottom: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
}

::v-deep .el-table--border th, .el-table__fixed-right-patch {
  border-bottom: 1px solid #DCDFE6 !important;
}

::v-deep .el-card__header {
  background: rgb(217, 236, 255);
}

::v-deep .el-table th > .cell {
  display: inline-block;
  white-space: nowrap;
  word-break: keep-all;
  text-overflow: unset;
}

.assets-center-container {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
  background-color: #fff;

  .assets-center-operate {
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .meta {
    background-color: #fafafa;
    border-top: 1px solid #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height .2s;
  }

  .assets-center-container {
    padding: 24px;
    box-sizing: border-box;
  }
}
</style>
