<template>
  <el-row>
    <el-col :span="6">
      <div style="margin-left: 20px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>权限分类</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleTopCreate">新建</el-button>
          </div>
          <div class="text item">
            <el-tree
              ref="tree"
              :data="queryDatalist"
              :props="defaultProps"
              node-key="id"
              @node-click="handleCheckChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => edit(node,data)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div>
    </el-col>

    <el-col :span="18">
      <div>
        <el-card class="box-card" shadow="hover" style="margin: 20px">
          <div slot="header" class="clearfix">
            <span>权限明细</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="RuleTopCreate">新建</el-button>
          </div>
          <div v-if="flag === false">请选择左侧节点</div>
          <div v-else-if="nodeData.length === 0 || nodeData.length === undefined">节点暂无数据</div>
          <div v-else>
            <!--            <div class="filter-container">-->
            <!--              <el-button-->
            <!--                class="el-button filter-item el-button&#45;&#45;primary"-->
            <!--                icon="el-icon-edit"-->
            <!--                style="margin-left: 10px;height: 35px"-->
            <!--                type="primary"-->
            <!--                @click="handleCreate"-->
            <!--              >-->
            <!--                新建-->
            <!--              </el-button>-->
            <!--            </div>-->
            <div class="text item">
              <el-table
                :data="nodeData"
                row-key="id"
                lazy
                border
                :header-cell-style="{textAlign: 'center'}"
                style="width: 100%"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  align="center"
                  width="80"
                />
                <el-table-column align="center" label="名称" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>

                <el-table-column align="center" label="path">
                  <template slot-scope="scope">
                    {{ scope.row.path }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="method" width="100">
                  <template slot-scope="scope">
                    <el-tag>{{ scope.row.method }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="角色">
                  <template slot-scope="scope">
                    <span v-for="item in Roleoptions" :key="item.id" :label="item.name">
                      <span v-for="(ite,index) in scope.row.role" :key="index" :label="ite">
                        <el-tag v-if="item.id === ite"> {{ item.name }}
                        </el-tag>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>

        <el-dialog :title="RuletextMap[dialogStatus]" :visible.sync="RuleFormVisible">
          <el-form :model="Ruledata">
            <el-form-item label="活动名称" label-width="80px" required>
              <el-input v-model="Ruledata.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="api路径" label-width="80px" required>
              <el-input v-model="Ruledata.path" autocomplete="off" />
            </el-form-item>
            <el-form-item label="请求方法">
              <el-radio v-model="Ruledata.method" label="GET">GET</el-radio>
              <el-radio v-model="Ruledata.method" label="POST">POST</el-radio>
              <el-radio v-model="Ruledata.method" label="PUT">PUT</el-radio>
              <el-radio v-model="Ruledata.method" label="PACH">PACH</el-radio>
              <el-radio v-model="Ruledata.method" label="DELETE">DELETE</el-radio>
            </el-form-item>
            <el-form-item label="角色" label-width="80px" required>
              <el-select v-model="Ruledata.role" multiple placeholder="请选择">
                <el-option
                  v-for="item in Roleoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createRuleData():updateRuleData()">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="classifyDialogFormVisible" width="30%">
          <el-form class="el-form" :model="tempData">
            <el-form-item label="分类名" label-width="80px" required>
              <el-input v-model="tempData.name" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleDownFormVisible">取 消</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Rule as masterApi } from '@/api/role'
import { Role } from '@/api/role'
import { Classify } from '@/api/role'

export default {
  name: 'Permission',

  data() {
    return {
      Roleoptions: {},
      classifyId: '',
      Ruledata: {
        name: '',
        role: '',
        path: '',
        method: 'GET',
        rule_classify: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        title: [{ required: true, message: '名称必填', trigger: 'blur' }],
        url: [{ required: true, message: '标识必填', trigger: 'blur' }]
      },
      queryDatalist: [],
      RuleFormVisible: false,
      classifyDialogFormVisible: false,
      dialogStatus: 'update',
      textMap: {
        update: '更新信息',
        create: '创建部门'
      },
      RuletextMap: {
        update: '更新规则信息',
        create: '创建规则信息'
      },
      tempData: {},
      switchStatus: false,
      nodeData: [],
      flag: false, // 如果为 false 则没有点击左侧 tree 节点
      nodeStatus: false,
      nodeId: 0
    }
  },
  created() {
    this.GetList()
    this.getUserInfo()
  },
  methods: {
    createRuleData() {
      var JsonData = {
        name: this.Ruledata.name,
        role: this.Ruledata.role,
        path: this.Ruledata.path,
        method: this.Ruledata.method,
        rule_classify: this.nodeId
      }
      masterApi.create(JsonData).then((request) => {
        this.classifyDialogFormVisible = false
        this.RuleFormVisible = false
        this.GetList()
        this.getPerNodes(this.nodeId)
        this.$notify({
          title: '成功',
          message: '创建数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateRuleData() {
    },
    // 获取角色信息
    getUserInfo() {
      this.Roleoptions = {}
      Role.list().then((request) => {
        this.Roleoptions = request.data.data
      })
    },
    // 删除
    handleDelete(scope) {
      this.defeteFunc(scope.row.id)
    },
    defeteFunc(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Classify.delete(id).then((request) => {
          this.GetList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    RuleTopCreate() {
      this.Ruledata = {}
      if (this.flag === false) {
        this.$notify({
          title: '警告信息',
          message: '请选择左边节点在新建规则!',
          type: 'error',
          duration: 2000
        })
      } else {
        this.dialogStatus = 'create'
        this.RuleFormVisible = true
      }
    },
    handleTopCreate() {
      this.switchStatus = true
      this.tempData = {}
      this.dialogStatus = 'create'
      this.classifyDialogFormVisible = true
    },
    handleDownFormVisible() {
      this.tempData = Object.assign({}, masterApi.delete)
      this.classifyDialogFormVisible = false
    },
    remove(node, data) {
      this.defeteFunc(data.id, data.pid)
    },
    edit(node, data) {
      this.tempData = {}
      this.nodeStatus = true
      this.dialogStatus = 'update'
      this.tempData = JSON.parse(JSON.stringify(data))
      this.switchStatus = true
      this.classifyDialogFormVisible = true
    },
    handleCheckChange(data, checked, indeterminate) {
      this.flag = true
      this.getPerNodes(data.id)
      this.nodeId = data.id
    },
    GetList() {
      Classify.list().then(response => {
        this.queryDatalist = response.data.data
      })
    },
    getPerNodes(pid) {
      masterApi.list({
        rule_classify_id: pid
      }).then(response => {
        this.nodeData = response.data.data
      })
    },
    handleEdit(scope) {
      this.nodeStatus = false
      this.classifyId = scope.row.id
      this.dialogStatus = 'update'
      this.tempData = JSON.parse(JSON.stringify(scope.row))
      this.switchStatus = false
      this.classifyDialogFormVisible = true
    },
    createData() {
      Classify.create(this.tempData).then((request) => {
        this.classifyDialogFormVisible = false
        this.GetList()
        this.getPerNodes(this.nodeId)
        this.$notify({
          title: '成功',
          message: '创建数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      Classify.update(this.tempData.id, this.tempData).then(() => {
        this.classifyDialogFormVisible = false
        this.GetList()
        this.getPerNodes(this.nodeId)
        this.$notify({
          title: '成功',
          message: '更新数据成功!',
          type: 'success',
          duration: 2000
        })
      })
    }
  },

  handleCreate() {
    this.tempData = {}
    this.switchStatus = false
    this.tempData.pid = this.nodeId
    this.dialogStatus = 'create'
    this.classifyDialogFormVisible = true
  },

  // 关闭抽屉
  cancelForm() {
    this.dialog = false
  },
  switchChange($event) {
    if ($event === true) {
      this.tempData.pid = 0
    } else {
      this.tempData.pid = ''
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
