<template>
  <!--  <div>-->

  <!--    <el-card class="box-card" style="margin-top: 10px" shadow="hover">-->
  <!--      <div style="background: #fafafa;border:2px solid #f2f5fa;height: 50px;">-->
  <!--        <el-form :inline="true" :model="searchInfo" style="margin-left: 15px; margin-top: 7px">-->
  <!--          <el-form-item label="模糊搜索">-->
  <!--            <el-input v-model="searchInfo.search" style="width: 230px" placeholder="请输入搜索内容"/>-->
  <!--          </el-form-item>-->

  <!--          <el-form-item style="float:right ">-->
  <!--            <el-button icon="el-icon-refresh" @click="searchOnReset">重置</el-button>-->

  <!--            <el-button type="primary" icon="el-icon-search" @click="getSearchData">查询</el-button>-->
  <!--            <el-button icon="el-icon-plus" type="primary" @click="addData('create')">新增</el-button>-->
  <!--          </el-form-item>-->
  <!--        </el-form>-->
  <!--      </div>-->
  <!--      <el-table-->
  <!--        ref="multipleTable"-->
  <!--        :data="dataList"-->
  <!--        :max-height="tableHeight"-->
  <!--        border-->
  <!--        :cell-style="{textAlign:'center'}"-->
  <!--        :header-cell-style="{textAlign: 'center',background:'#fafafa',color:'#606266'}"-->
  <!--        tooltip-effect="dark"-->
  <!--        style="width: 100%"-->
  <!--        @selection-change="tableSelectChange"-->
  <!--      >-->
  <!--        &lt;!&ndash;        <el-table-column&ndash;&gt;-->
  <!--        &lt;!&ndash;          type="selection"&ndash;&gt;-->
  <!--        &lt;!&ndash;          width="55"&ndash;&gt;-->
  <!--        &lt;!&ndash;        />&ndash;&gt;-->
  <!--        <el-table-column-->
  <!--          label="序号"-->
  <!--          type="index"-->
  <!--          fixed="left"-->
  <!--          width="80"-->
  <!--        />-->
  <!--        <el-table-column-->
  <!--          prop="name"-->
  <!--          label="媒介名称"-->
  <!--          width="220"-->
  <!--        />-->
  <!--        <el-table-column-->
  <!--          prop="provider_class"-->
  <!--          label="媒介类"-->
  <!--          width="360"-->
  <!--        />-->
  <!--        <el-table-column-->
  <!--          prop="method_name"-->
  <!--          label="媒介方法"-->
  <!--          width="240"-->
  <!--        />-->
  <!--        <el-table-column-->
  <!--          prop="created_at"-->
  <!--          label="创建时间"-->
  <!--          width="200"-->
  <!--        />-->
  <!--        <el-table-column-->
  <!--          prop="updated_at"-->
  <!--          label="更新时间"-->
  <!--          width="200"-->
  <!--        />-->
  <!--        &lt;!&ndash;          show-overflow-tooltip&ndash;&gt;-->

  <!--        <el-table-column align="center" class-name="small-padding fixed-width" fixed="right" label="操作" width="230">-->
  <!--          <template slot-scope="{row}">-->
  <!--            <el-button size="mini" type="text" icon="el-icon-edit" @click="addData(row)">-->
  <!--              编辑-->
  <!--            </el-button>-->
  <!--            &lt;!&ndash;            <el-button size="mini" type="success" @click="testFormFunc(row)">&ndash;&gt;-->
  <!--            &lt;!&ndash;              测试&ndash;&gt;-->
  <!--            &lt;!&ndash;            </el-button>&ndash;&gt;-->
  <!--            <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteData(row)">-->
  <!--              删除-->
  <!--            </el-button>-->
  <!--          </template>-->
  <!--        </el-table-column>-->
  <!--      </el-table>-->
  <!--      <el-pagination-->
  <!--        v-show="pageQuerylist.total>0"-->
  <!--        background-->
  <!--        :total="pageQuerylist.total"-->
  <!--        :current-page="pageQuerylist.page"-->
  <!--        :page-sizes="pageQuerylist.sizes"-->
  <!--        :page-size="pageQuerylist.limit"-->
  <!--        layout="total, sizes, prev, pager, next, jumper"-->
  <!--        @size-change="handleSizeChange"-->
  <!--        @current-change="handlePageChange"-->
  <!--      />-->
  <!--      <AddTableData-->
  <!--        :show-visible.sync="addDialogFormVisible"-->
  <!--        :add-form-data.sync="addRowData"-->
  <!--        :method-visible.sync="addMethodVisible"-->
  <!--        @show-func="addShowFunc"-->
  <!--      />-->
  <!--    </el-card>-->

  <!--  </div>-->

  <div class="data-center-tablemanage">
    <div class="tablemanage-operate">
      <el-input
        v-model="search"
        prefix-icon="el-icon-search"
        placeholder="请输入内容"
        style="width: 200px; margin-left:10px;"
        @keyup.enter.native="fetchTableClassifyTree"
      />
      <el-button icon="el-icon-plus" type="primary" @click="addData('create')">新增</el-button>
    </div>
    <div class="meta" />
    <div class="tablemanage-container">
      <el-row :gutter="20">
        <el-col v-for="(item, i) in dataList" :key="i" :span="12">
          <el-card :body-style="{ padding: '10px' }" style="margin-bottom:10px;" shadow="hover">
            <div class="card-tablemanage" @click="addData(item)">
              <div class="image"><img :src="item.icon"></div>
              <div class="right">
                <p class="card-title">{{ item.name }}</p>
                <div class="card-info one-line">
                  <div class="infos"><span>媒介类: </span><span>{{ item.provider_class }}</span></div>
                  <div class="infos"><span>创建时间: </span><span>{{ item.created_at }}</span></div>
                </div>
                <div class="card-info">
                  <div class="infos desc"><span>媒介方法: </span><span>{{ item.method_name }}</span></div>
                </div>
              </div>
              <div class="card-buttons">
                <el-button
                  plain
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  circle
                  @click.stop="addData(item)"
                />
                <el-button
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  @click.stop="deleteData(item)"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <AddTableData
      :show-visible.sync="addDialogFormVisible"
      :add-form-data.sync="addRowData"
      :method-visible.sync="addMethodVisible"
      @show-func="addShowFunc"
    />
  </div>
</template>

<script>
import { Provider as masterApi } from '@/api/message-center'
import AddTableData from './components/add'
import moment from 'moment'
import { getPageQueryList } from '@/utils/page-query'

const defaultProvider = {
  name: '',
  provider_class: '',
  method: ''
}

export default {
  name: 'Index',
  components: {
    AddTableData
  },
  filters: {
    formatDate: function(date) {
      return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      mainDetailData: '',
      mainVisible: false,
      // info 跳转路由名
      infoRouteNmae: 'IAC_REPOSITORY_DETAIL',
      // 新增form表单
      addDialogFormVisible: false,
      addRowData: JSON.parse(JSON.stringify(defaultProvider)),
      addMethodVisible: 'create',
      // 表格多选相关
      tableChangeList: [],
      dataList: [],
      tableHeight: window.innerHeight - 290,
      // 搜索相关
      pageQuerylist: JSON.parse(JSON.stringify(getPageQueryList())),
      searchInfo: {
        type: '',
        status: '',
        search: ''
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    // testFormFunc(row) {
    //   this.$confirm('正在测试媒介, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const loading = this.$loading({
    //       lock: true,
    //       text: '媒介测试中请等候....',
    //       spinner: 'el-icon-loading',
    //       background: 'rgba(0, 0, 0, 0.7)'
    //     })
    //     historyApi.test({provider_id: row.id}).then(res => {
    //       loading.close()
    //       this.$notify({
    //         title: '成功',
    //         message: '媒介测试成功，请检查!',
    //         type: 'success',
    //         duration: 5000
    //       })
    //     }).catch(() => {
    //       loading.close()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消创建'
    //     })
    //   })
    // },
    addShowFunc(val) {
      this.methodVisible = 'create'
      this.addDialogFormVisible = false
      this.addRowData = JSON.parse(JSON.stringify(defaultProvider))
      this.getList()
    },
    deleteData(row) {
      this.$confirm('正在删除任务调度, 此操作不可逆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        masterApi.delete(row.id).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '调度任务删除已提交!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    },
    getList() {
      masterApi.list({
        from_periodic_null: this.searchInfo.from_periodic_null,
        repository: this.searchInfo.repository,
        state: this.searchInfo.state,
        search: this.searchInfo.search,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }).then(response => {
        this.dataList = response.data.result
        this.pageQuerylist.total = response.data.count
      })
    },
    searchOnReset() {
      this.searchInfo = {}
    },
    addData(val) {
      if (val === 'create') {
        this.addMethodVisible = 'create'
        this.addDialogFormVisible = false
        this.addDialogFormVisible = true
        this.addRowData = JSON.parse(JSON.stringify(defaultProvider))
      } else {
        this.addMethodVisible = 'update'
        this.addDialogFormVisible = true
        this.addRowData = JSON.parse(JSON.stringify({
          'name': val.name,
          'provider_class': val.provider_class,
          'id': val.id,
          method: val.method
        }))
      }
    },
    // 多选表格相关
    tableSelectChange(val) {
      this.tableChangeList = []
      for (var key in val) {
        this.tableChangeList.push(Number(val[key]['id']))
      }
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getList()
    },
    handlePageChange(val) {
      this.pageQuerylist.page = val
      this.getList()
    },
    getSearchData() {
      this.pageQuerylist.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.data-center-tablemanage {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: .2s;
  background-color: #fff;

  .tablemanage-operate {
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .meta {
    background-color: #fafafa;
    border-top: 1px solid #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height .2s;
  }

  .tablemanage-container {
    padding: 24px;
    box-sizing: border-box;

    .type-header {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      margin-top: 10px;

      .title {
        border-left: 2px solid #409EFF;
        padding-left: 4px;
        box-sizing: border-box;
        margin-right: 10px;
      }
    }

    .card-tablemanage {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      cursor: pointer;
      position: relative;
      height: 122px;

      .image {
        width: 100px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        flex: 1;

        & > img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .right {
        width: calc(100% - 110px);

        .card-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .card-info {
          .infos {
            font-size: 12px;

            & > span {
              color: #606266;

              &:first-child {
                color: #909399;
              }
            }
          }
        }

        .desc {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
        }

        .one-line {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
      }

      .card-buttons {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}

</style>
