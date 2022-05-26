<template>
  <div>
    <el-dialog
      :title="methodVisible==='create'?dialogCreateTitle:dialogUpdateTitle"
      :width="dialogWidth"
      :visible.sync="showVisible"
      :append-to-body="false"
      :close-on-click-modal="false"
      top="2vh"
      @close="closeDia('addFormData')"
    >

      <div style="height: 550px; overflow: auto">
        <el-form ref="addFormData" :model="addFormData" label-width="100px">
          <el-form-item label="任务名" prop="name" required>
            <el-input v-model="addFormData.name" />
          </el-form-item>
          <el-form-item label="结果通告" prop="alert" required>
            <el-switch
              v-model="addFormData.alert"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>

          <el-form-item label="项目" prop="repository" required>
            <el-select v-model="addFormData.repository" filterable placeholder="请选择">
              <el-option
                v-for="item in dataList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入口文件">
            <el-input v-model="addFormData.playbook" />
          </el-form-item>
          <el-form-item label="主机列表">
            <div class="key-value">
              <label for="">主机地址: </label>
              <el-input v-model="inventoryValue" size="small" style="width: 205px" />
              <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('inventory')">添加
              </el-button>
              <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag('inventory')">删除</el-button>
            </div>
            <el-descriptions :column="1" border>
              <template slot="extra" />
              <el-descriptions-item>
                <template slot="label">
                  已录入数据
                </template>
                {{ addFormData.inventory }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>

          <el-form-item label="变量">
            <div class="key-value">
              <label for="">键</label>
              <el-input v-model="envvarsKey" size="small" style="width: 120px" />
              <label for="">值</label>
              <el-input v-model="envvarsValue" size="small" style="width: 120px" />
              <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('envvars')">添加</el-button>
              <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag('envvars')">删除</el-button>
            </div>
            <el-descriptions :column="1" border>
              <template slot="extra" />
              <el-descriptions-item>
                <template slot="label">
                  已录入数据
                </template>
                {{ addFormData.envvars }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>
          <!--        <el-form-item label="环境变量">-->
          <!--          <el-input v-model="addFormData.extravars" placeholder="示例代码: {'key': 'val'}"/>-->
          <!--        </el-form-item>-->
          <el-form-item label="环境变量">
            <div class="key-value">
              <label for="">键</label>
              <el-input v-model="extravarsKey" size="small" style="width: 120px" />
              <label for="">值</label>
              <el-input v-model="extravarsValue" size="small" style="width: 120px" />
              <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('extravars')">添加
              </el-button>
              <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag('extravars')">删除</el-button>
            </div>
            <el-descriptions :column="1" border>
              <template slot="extra" />
              <el-descriptions-item>
                <template slot="label">
                  已录入数据
                </template>
                {{ addFormData.extravars }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>

          <el-form-item label="执行角色">
            <div class="key-value">
              <label for="">角色名称: </label>
              <el-input v-model="roleValue" size="small" style="width: 205px" />
              <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('role')">添加
              </el-button>
              <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag('role')">删除</el-button>
            </div>
            <el-descriptions :column="1" border>
              <template slot="extra" />
              <el-descriptions-item>
                <template slot="label">
                  已录入数据
                </template>
                {{ addFormData.role }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>

          <el-form-item label="执行标签">
            <div class="key-value">
              <label for="">标签名称: </label>
              <el-input v-model="tagsValue" size="small" style="width: 205px" />
              <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('tags')">添加
              </el-button>
              <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag('tags')">删除</el-button>
            </div>
            <el-descriptions :column="1" border>
              <template slot="extra" />
              <el-descriptions-item>
                <template slot="label">
                  已录入数据
                </template>
                {{ addFormData.tags }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>

          <el-form-item label="跳过标签">
            <div class="key-value">
              <label for="">标签名称: </label>
              <el-input v-model="skip_tagsValue" size="small" style="width: 205px" />
              <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('skip_tags')">添加
              </el-button>
              <el-button size="small" type="danger" @click="confirmDeleteEnvvarsTag('skip_tags')">删除</el-button>
            </div>
            <el-descriptions :column="1" border>
              <template slot="extra" />
              <el-descriptions-item>
                <template slot="label">
                  已录入数据
                </template>
                {{ addFormData.skip_tags }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>
          <el-form-item label="并发数" prop="forks" required>
            <el-input v-model="addFormData.forks" type="number" />
          </el-form-item>
          <el-form-item label="超时时间(s)" prop="timeout" required>
            <el-input v-model="addFormData.timeout" type="number" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addFormData.describe" type="textarea" />
          </el-form-item>
          <el-form-item />
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diskRunFormFunc('addFormData')">前台运行</el-button>
        <el-button type="primary" @click="syncRunFormFunc('addFormData')">异步运行
        </el-button>
        <el-button @click="closeDia('addFormData')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="前台执行"
      :visible.sync="websocketDialogVisible"
      width="60%"
      top="2vh"
      :close-on-click-modal="false"
      center
    >
      <div>
        <pre class="language-yaml  line-numbers" style="height: 600px; ">
                    <code id="wsServerStatus" class="language-yaml line-numbers copy-to-clipboard" />
                </pre>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="websocketDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import Prism from 'prismjs'// 引入插件
import Term from 'ansi_up'

const ansiUp = new Term()
import { Task as masterApi } from '@/api/iac'
import { REPOSITORY as repositoryApi } from '@/api/iac'

const defaultaddFormData = {
  name: '',
  playbook: '',
  repository: '',
  inventory: [],
  envvars: new Map(),
  extravars: new Map(),
  forks: 1,
  timeout: 3600,
  tags: [],
  skip_tags: [],
  role: [],
  describe: '',
  alert: false
}
export default {
  name: 'Run',
  props: {
    showVisible: {
      type: Boolean,
      default:
        false
    },
    addFormData: {
      type: Object,
      default: JSON.parse(JSON.stringify(defaultaddFormData))
    },
    methodVisible: {
      type: String,
      default: 'create'
    }

  },
  data() {
    return {
      dialogCreateTitle: '新增定时任务',
      dialogUpdateTitle: '更新定时任务',
      dialogWidth: '50%',
      dataList: [],
      ruleForm: {},
      tmpFile: {},
      title: '创建任务',
      updateTitle: '重复执行',
      width: '50%',
      envvarsValue: '',
      envvarsKey: '',
      extravarsValue: '',
      extravarsKey: '',
      inventoryValue: '',
      roleValue: '',
      tagsValue: '',
      skip_tagsValue: '',
      websocketDialogVisible: false,
      webSocketData: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 高亮渲染
    Prism.highlightAll()
  },
  methods: {
    confirmAddEnvvarsTag(val) {
      if (val === 'envvars') {
        if (!this.envvarsValue || !this.envvarsKey) {
          this.$message({
            message: '键值都不能为空',
            type: 'warning'
          })
        } else {
          this.addFormData.envvars[this.envvarsKey] = this.envvarsValue
          this.envvarsKey = ''
          this.envvarsValue = ''
        }
      } else if (val === 'extravars') {
        if (!this.extravarsValue || !this.extravarsKey) {
          this.$message({
            message: '键值都不能为空',
            type: 'warning'
          })
        } else {
          this.addFormData.extravars[this.extravarsKey] = this.extravarsValue
          this.extravarsKey = ''
          this.extravarsValue = ''
        }
      } else if (val === 'inventory') {
        if (this.addFormData.inventory.indexOf(this.inventoryValue) === -1) {
          this.addFormData.inventory.push(this.inventoryValue)
          this.inventoryValue = ''
        } else {
          this.$message({
            message: `值已经存在不能重复录入: ${this.inventoryValue}`,
            type: 'warning'
          })
        }
      } else if (val === 'role') {
        if (this.addFormData.role.indexOf(this.roleValue) === -1) {
          this.addFormData.role.push(this.roleValue)
          this.roleValue = ''
        } else {
          this.$message({
            message: `值已经存在不能重复录入: ${this.roleValue}`,
            type: 'warning'
          })
        }
      } else if (val === 'tags') {
        if (this.addFormData.tags.indexOf(this.tagsValue) === -1) {
          this.addFormData.tags.push(this.tagsValue)
          this.tagsValue = ''
        } else {
          this.$message({
            message: `值已经存在不能重复录入: ${this.tagsValue}`,
            type: 'warning'
          })
        }
      } else if (val === 'skip_tags') {
        if (this.addFormData.skip_tags.indexOf(this.skip_tagsValue) === -1) {
          this.addFormData.skip_tags.push(this.skip_tagsValue)
          this.skip_tagsValue = ''
        } else {
          this.$message({
            message: `值已经存在不能重复录入: ${this.skip_tagsValue}`,
            type: 'warning'
          })
        }
      }
    },
    confirmDeleteEnvvarsTag(val) {
      if (val === 'envvars') {
        if (!this.envvarsKey) {
          this.$message({
            message: '删除键，键的 key 不能为空。',
            type: 'warning'
          })
        } else {
          if (!this.addFormData.envvars[this.envvarsKey]) {
            this.$message({
              message: `指定的键不存在，${this.envvarsKey}`,
              type: 'warning'
            })
          } else {
            delete this.addFormData.envvars[this.envvarsKey]
            this.envvarsKey = ''
            this.envvarsValue = ''
          }
        }
      } else if (val === 'extravars') {
        if (!this.extravarsKey) {
          this.$message({
            message: '删除键，键的 key 不能为空。',
            type: 'warning'
          })
        } else {
          if (!this.addFormData.extravars[this.extravarsKey]) {
            this.$message({
              message: `指定的键不存在，${this.extravarsKey}`,
              type: 'warning'
            })
          } else {
            delete this.addFormData.extravars[this.extravarsKey]
            this.extravarsKey = ''
            this.envvarsValue = ''
          }
        }
      } else if (val === 'inventory') {
        if (this.addFormData.inventory.indexOf(this.inventoryValue) === -1) {
          this.$message({
            message: `已录入数据找不到删除的值。${this.inventoryValue}`,
            type: 'warning'
          })
        } else {
          this.addFormData.inventory.splice(this.addFormData.inventory.indexOf(this.inventoryValue), 1)
          this.inventoryValue = ''
        }
      } else if (val === 'role') {
        if (this.addFormData.role.indexOf(this.roleValue) === -1) {
          this.$message({
            message: `已录入数据找不到删除的值。${this.roleValue}`,
            type: 'warning'
          })
        } else {
          this.addFormData.role.splice(this.addFormData.role.indexOf(this.roleValue), 1)
          this.roleValue = ''
        }
      } else if (val === 'tags') {
        if (this.addFormData.tags.indexOf(this.tagsValue) === -1) {
          this.$message({
            message: `已录入数据找不到删除的值。${this.tagsValue}`,
            type: 'warning'
          })
        } else {
          this.addFormData.tags.splice(this.addFormData.tags.indexOf(this.tagsValue), 1)
          this.tagsValue = ''
        }
      } else if (val === 'skip_tags') {
        if (this.addFormData.skip_tags.indexOf(this.skip_tagsValue) === -1) {
          this.$message({
            message: `已录入数据找不到删除的值。${this.skip_tagsValue}`,
            type: 'warning'
          })
        } else {
          this.addFormData.skip_tags.splice(this.addFormData.skip_tags.indexOf(this.skip_tagsValue), 1)
          this.skip_tagsValue = ''
        }
      }
    },
    serializersData() {
      // this.addFormData.role = this.addFormData.role.join(',')
      // this.addFormData.tags = this.addFormData.tags.join(',')
      // this.addFormData.skip_tags = this.addFormData.skip_tags.join(',')
      // this.addFormData.inventory = this.addFormData.inventory.join(',')
      // if (!this.addFormData.extravars) {
      //   this.addFormData.extravars = ''
      // } else {
      //   this.addFormData.extravars = this.addFormData.extravars.toString()
      // }
      // if (!this.addFormData.envvars) {
      //   this.addFormData.envvars = ''
      // } else {
      //   this.addFormData.envvars = this.addFormData.envvars.toString()
      // }

    },
    mssg() {
      this.webSocketData = ''
      this.$message({
        showClose: true,
        duration: 60000,
        type: 'success',
        message: '任务运行完成，websocket已经断开连接请检查日志'
      })
    },
    erroMssg() {
      this.webSocketData = ''
      this.$message({
        showClose: true,
        duration: 60000,
        type: 'error',
        message: 'websocket 连接错误，请检查日志'
      })
    },
    wsResultData(url) {
      var ws = new WebSocket(url)
      this.closeDia()
      this.websocketDialogVisible = true

      ws.onmessage = function(evt) {
        // var websocketMapData = eval("(" + evt.data + ")")
        var websocketMapData = JSON.parse(evt.data)
        this.webSocketData = ansiUp.ansi_to_html(websocketMapData.output)
        document.getElementById('wsServerStatus').innerHTML = this.webSocketData
        if (websocketMapData.state !== 'RUNNING' || websocketMapData.state !== 'RUNNING') {
          func1(this.webSocketData)

          ws.onclose = (evt) => {
            console.log('websocket 正常关闭')
          }
        }
      }
      const func2 = function func3(val) {
        this.mssg()
        ws.onclose = (evt) => {
          console.log('websocket 正常关闭')
        }
      }
      const func1 = func2.bind(this)
      ws.onerror = function(err) {
        func4(err)
        ws.onclose = (evt) => {
          console.log('websocket 异常关闭')
        }
      }
      const func5 = function func6(val) {
        this.websocketDialogVisible = false
        this.erroMssg()
      }
      const func4 = func5.bind(this)
      //   ws.onclose = function() {
      //     // 关闭 websocket
      //   }
      // }
    },
    diskRunFormFunc(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.$confirm('正在新建项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.serializersData()
            masterApi.create(this.addFormData).then(response => {
              this.wsResultData(`${response.data.ws_url}`)
              // ws.onopen = function () {
              //   // Web Socket 已连接上，使用 send() 方法发送数据
              //   ws.send("发送数据")
              //   alert("数据发送中...")
              // }
              //

              //   // this.closeDia()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消！'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    syncRunFormFunc(addFormData) {
      this.$refs[addFormData].validate((valid) => {
        if (valid) {
          this.$confirm('正在异步创建项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.serializersData()
            masterApi.create_rsync(this.addFormData).then(response => {
              this.$notify({
                title: '成功',
                message: '异步提交任务成功!',
                type: 'success',
                duration: 2000
              })
              this.closeDia()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消！'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getList() {
      repositoryApi.list().then(response => {
        this.dataList = response.data
      })
    },
    closeDia(formName) {
      // this.$refs[formName].resetFields()
      // this.addFormData = JSON.parse(JSON.stringify(defaultaddFormData))
      // this.$emit('update:show', false)
      this.$emit('show-func', false)
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

.tags-container {
  width: 100%;
  height: 150px;
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 15px;
}

.key-value {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;

label {
  /*// margin-right: 10px;*/
}

.el-input {
  width: 100px;
  margin: 0 10px;
}

}

.el-form-item {
  margin-bottom: 20px;
}

</style>
