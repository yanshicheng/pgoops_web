<template>
  <div style="margin: 30px">
    <el-page-header :content="'详情信息'" style="margin-bottom: 10px;" @back="goBack" />
    <div class="data-center-table">
      <div class="classify-nav">
        <p :class="{'active': currentNav === 'basicInfo'}" @click="currentNav = 'basicInfo'">基本信息</p>
        <p :class="{'active': currentNav === 'MyRelation'}" @click="currentNav = 'MyRelation'">我关联的</p>
        <p :class="{'active': currentNav === 'relationMe'}" @click="currentNav = 'relationMe'">关联我的</p>
        <p :class="{'active': currentNav === 'change'}" @click="currentNav = 'change'">变更记录</p>
      </div>
      <div class="meta" />
      <div v-show="currentNav === 'basicInfo'" class="classify-container">
        <el-form ref="form" label-width="150px" style="width: 500px; margin: auto;">
          <el-form-item v-for="(item, index) in cardInfo" :key="index" :label="item.label+' : '">
            <span>{{ item.value }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="currentNav === 'MyRelation'" class="classify-container">
        <template v-if="myRelationTableData">
          <div v-for="(items, index) in myRelationTableData" :key="index" style="margin-bottom: 20px;">
            <el-card>
              <div
                slot="header"
                class="clearfix"
                style="display:flex;align-items:center;justify-content:space-between;"
              >
                <span style="font-weight:bold;font-size:16px;color: #303133;">{{ items.classify_name }}</span>
              </div>
              <el-table :data="items.tableList" border style="width: 100%">
                <el-table-column type="index" width="50" label="序号" fixed />
                <el-table-column
                  v-for="(item, i) in items.theadList"
                  :key="i"
                  v-bind="item"
                  :label="item.label"
                  :prop="item.props"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[item.props] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </template>
        <div v-else class="no-data">暂无数据</div>
      </div>
      <div v-show="currentNav === 'relationMe'" class="classify-container">
        <template v-if="relationMeTableData">
          <div v-for="(items, index) in relationMeTableData" :key="index" style="margin-bottom: 20px;">
            <el-card>
              <div
                slot="header"
                class="clearfix"
                style="display:flex;align-items:center;justify-content:space-between;"
              >
                <span style="font-weight:bold;font-size:16px;color: #303133;">{{ items.classify_name }}</span>
              </div>
              <el-table :data="items.tableList" border style="width: 100%">
                <el-table-column type="index" width="50" label="序号" fixed />
                <el-table-column
                  v-for="(item, i) in items.theadList"
                  :key="i"
                  v-bind="item"
                  :label="item.label"
                  :prop="item.props"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[item.props] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </template>
        <div v-else class="no-data">暂无数据</div>
      </div>
      <div v-show="currentNav === 'change'" class="classify-container">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in changeData"
            :key="index"
            :timestamp="item.create_at"
            placement="top"
          >
            <div class="year">{{ item.create_at }}</div>
            <el-card shadow="hover">
              <div class="card-infos">
                <p style="font-weight:bold;font-size:16px;">{{ item.title }}</p>
                <pre
                  style="white-space: pre-wrap;margin:15px 0;line-height: 20px;"
                >{{
                    item.detail
                }}</pre>
                <p style="font-size:14px;text-align:right;font-weight:bold;">{{ item.operator }}</p>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-pagination
          v-show="pageQuerylist.total>0"
          :current-page="pageQuerylist.page"
          :page-size="pageQuerylist.limit"
          :page-sizes="pageQuerylist.sizes"
          :total="pageQuerylist.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CMDBAssets as masterApi } from '@/api/data-map'
import { Record as CMDBRecord } from '@/api/data-map'

export default {
  name: '',
  data() {
    return {
      currentNav: 'basicInfo',
      myRelationTableData: [],
      relationMeTableData: [],
      cardInfo: {},
      currentPage: 1,
      pageQuerylist: {
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 30, 40, 50],
        search: ''
      },
      changeData: []
    }
  },
  created() {
    this.getDetails()
    this.currentNav = 'basicInfo'
    this.getChangeRecords()
  },
  beforeDestroy() {
    this.currentNav = 'basicInfo'
    this.changeData = []
    this.myRelationTableData = []
    this.relationMeTableData = []
    this.currentPage = 1
    this.cardInfo = {}
    this.total = 0
  },
  methods: {
    getDetails() {
      if (!this.$route.query.id) return false
      masterApi.get(this.$route.query.id).then(res => {
        this.cardInfo = this.formatBaiscInfo(res.data.result ? res.data.result : res.data)
        this.myRelationTableData = this.formatTableData(res.data.children)
        this.relationMeTableData = this.formatTableData(res.data.relevant)
      })
    },
    handleSizeChange(val) {
      this.pageQuerylist.size = val
      this.pageQuerylist.page = 1
      this.getChangeRecords()
    },
    handleCurrentChange(val) {
      this.pageQuerylist.page = val
      this.getChangeRecords()
    },
    searchFilter() {
      this.pageQuerylist.page = 1
      this.pageQuerylist.size = 10
      this.getChangeRecords()
    },
    formatBaiscInfo(tableObj) {
      const valueData = tableObj.data ? tableObj.data.data : {}
      const fields = tableObj ? tableObj.fields : {}
      const theadList = []
      for (const key in fields) {
        theadList.push({
          props: key,
          label: tableObj.fields[key]['name'],
          order: tableObj.fields[key]['order'],
          value: valueData[key]
        })
      }
      theadList.sort((a, b) => a.order - b.order)
      return theadList
    },
    formatTableData(children) {
      if (!children) return false
      const allTableData = []
      children.forEach(items => {
        const fields = items ? items.fields : {}
        const theadList = []
        for (const key in fields) {
          theadList.push({
            props: key,
            label: items.fields[key]['name'],
            order: items.fields[key]['order']
          })
        }
        theadList.sort((a, b) => a.order - b.order)

        const data = items ? items.data : []
        const tableList = data.map(item => {
          const obj = { ...item, ...item.data }
          return obj
        })
        const tableObj = {
          theadList,
          tableList,
          classify_name: items.classify_name,
          classify_id: items.classify_id
        }
        allTableData.push(tableObj)
      })
      return allTableData
    },
    getChangeRecords() {
      if (!this.$route.query.id) return false
      const params = {
        asset_id: this.$route.query.id,
        page: this.pageQuerylist.page,
        size: this.pageQuerylist.size
      }
      CMDBRecord.list(params).then(res => {
        if (res.data && res.data.result && res.data.result.length) {
          this.changeData = res.data.result ? res.data.result : res.data
          this.pageQuerylist.total = res.data.count
        }
      })
    },
    goBack() {
      this.$router.push({ name: 'CmdbAsset' })
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

.table-head {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.year {
  position: absolute;
  left: -150px;
  top: 1px;
}

// .card-infos {
//     &>p {
//         display: flex;
//         flex-direction: row;
//         justify-content: flex-start;
//         align-items: flex-start;
//         &>label {
//             width: 120px;
//             flex-shrink: 0;
//         }
//     }
// }
::v-deep .el-timeline {
  margin-left: 150px;

  .el-timeline-item__timestamp {
    display: none;
  }
}

::v-deep .el-pagination {
  margin-top: 10px;
  text-align: center;
}

::v-deep .el-card__header {
  background: rgb(217, 236, 255);
}
</style>
