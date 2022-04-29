<template>
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
        <el-form-item label="结果通告" prop="alert" required>
          <el-switch
            v-model="addFormData.alert"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="调度计划">
          <div>
            <el-radio-group v-model="scheduling_mode" size="medium">
              <el-radio-button label="crontab" style="width: 50%">CRONTAB</el-radio-button>
              <el-radio-button label="interval">INTERVAL</el-radio-button>
            </el-radio-group>

          </div>
          <div style="margin-top: 5px">
            <div v-if="scheduling_mode === 'crontab' ">
              <el-row>
                <el-col :span="3">
                  <el-input v-model="addFormData.crontab.minute" placeholder="分，默认 *" style="width: 100%" size="small" />
                  分
                </el-col>
                <el-col :span="3">
                  <el-input v-model="addFormData.crontab.hour" placeholder="时，默认 *" style="width: 100%" size="small" />
                  时
                </el-col>
                <el-col :span="3">
                  <el-input
                    v-model="addFormData.crontab.day_of_month"
                    placeholder="日，默认 *"
                    style="width: 100%"
                    size="small"
                  />
                  日
                </el-col>
                <el-col :span="4">
                  <el-input
                    v-model="addFormData.crontab.month_of_year"
                    placeholder="月，默认 *"
                    style="width: 100%"
                    size="small"
                  />
                  月
                </el-col>
                <el-col :span="4">
                  <el-input
                    v-model="addFormData.crontab.day_of_week"
                    placeholder="周，默认 *"
                    style="width: 100%"
                    size="small"
                  />
                  周
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <el-row>

                <el-col :span="3">
                  <el-select v-model="addFormData.interval.period">
                    <el-option
                      v-for="item in period_choice"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  调度模式
                </el-col>
                <el-col :span="3">
                  <el-input v-model="addFormData.interval.every" placeholder="请输入间隔周期" type="number" />
                  间隔周期
                </el-col>
              </el-row>
            </div>
          </div>
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
        <el-form-item label="环境变量">
          <div class="key-value">
            <label for="">键</label>
            <el-input v-model="extravarsKey" size="small" style="width: 120px" />
            <label for="">值</label>
            <el-input v-model="extravarsValue" size="small" style="width: 120px" />
            <el-button size="small" style="margin-left: 15px" @click="confirmAddEnvvarsTag('extravars')">添加</el-button>
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
      <el-button @click="addData('addFormData')">提交</el-button>
      <el-button @click="closeDia('addFormData')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { TaskPeriodic as masterApi } from '@/api/iac'
import { REPOSITORY as repositoryApi } from '@/api/iac'

const defaultaddFormData = {
  name: '',
  repository: '',
  playbook: '',
  inventory: [],
  envvars: new Map(),
  extravars: new Map(),
  forks: 1,
  timeout: 3600,
  role: [],
  tags: [],
  skip_tags: [],
  crontab: {
    minute: '*/10',
    hour: '*',
    day_of_week: '*',
    day_of_month: '*',
    month_of_year: '*',
    timezone: 'Asia/Shanghai'
  },
  interval: {
    period: 'HOURS',
    every: 10
  },
  describe: ''
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
      drawerFileList: [],
      tmpFile: {},
      title: '创建任务',
      updateTitle: '重复执行',
      width: '50%',
      scheduling_mode: 'crontab',
      period_choice: [
        {
          value: 'days',
          label: '天'
        },
        {
          value: 'hours',
          label: '小时'
        }, {
          value: 'minutes',
          label: '分钟'
        }, {
          value: 'seconds',
          label: '秒'
        }, {
          value: 'microseconds',
          label: '微妙'
        }],
      envvarsValue: '',
      envvarsKey: '',
      extravarsValue: '',
      extravarsKey: '',
      inventoryValue: '',
      roleValue: '',
      tagsValue: '',
      skip_tagsValue: ''
    }
  },
  created() {
    this.getList()
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
      const tmpData = JSON.parse(JSON.stringify(this.addFormData))
      if (this.scheduling_mode === 'crontab') {
        delete tmpData['interval']
      } else {
        delete tmpData['crontab']
      }
      return tmpData
    },
    addData(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.$confirm('正在创建定时任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            masterApi.create(this.serializersData()).then(response => {
              this.$notify({
                title: '成功',
                message: '定时任务创建成功!',
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
      this.$emit('show-func', false)
      this.$refs[formName].resetFields()
      // this.addFormData = JSON.parse(JSON.stringify(defaultaddFormData))
      // this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped>

.el-form-item {
  margin-bottom: 20px;
}

</style>
