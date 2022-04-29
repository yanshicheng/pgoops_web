<template>
  <div class="auth-manage">
    <div class="group">
      <label for="">开发者：</label>
      <el-select v-model="readMembers" multiple filterable placeholder="请选择" style="width: 60%;" @change="readMembersChange" @remove-tag="readMembersDelete">
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="`${item.name}(${item.username})`"
          :value="item.id"
        >
          <span style="float: left">{{ item.name }}-{{ item.username }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 15px;">{{ item.email }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="group">
      <label for="">管理者：</label>
      <el-select v-model="writeMembers" multiple filterable placeholder="请选择" style="width: 60%;" @change="writeMembersChange" @remove-tag="writeMembersDelete">
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="`${item.name}(${item.username})`"
          :value="item.id"
        >
          <span style="float: left">{{ item.name }}-{{ item.username }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 15px;">{{ item.email }}</span>
        </el-option>
      </el-select>
    </div>
    <!-- <div class="names">
            <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                size="small"
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
            </el-tag>
        </div> -->
  </div>
</template>
<script>
import { ServiceTreePerm as masterApi } from '@/api/server-tree'
import { ServiceTree } from '@/api/server-tree'
import { UserInfoO } from '@/api/user'

export default {
  name: '',
  props: {
    nodes: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      readMembers: [],
      writeMembers: [],
      currentNode: null,
      userList: []
    }
  },
  watch: {
    nodes(newVal) {
      if (newVal) {
        this.currentNode = Object.assign({}, newVal)
        this.fetchOperaPermissionMember()
      }
    }
  },
  created() {
    this.currentNode = Object.assign({}, this.nodes)
    this.fetchOperaPermissionMember()
    this.fetchCorpUsers()
  },
  methods: {
    fetchCorpUsers() {
      UserInfoO.list().then(res => {
        this.userList = res.data
      })
    },
    addOperaPermission(params) {
      const param = {
        ...params,
        node: this.currentNode.pk
      }
      masterApi.create(param).then(res => {
        // this.userList = res.data.results;
        this.$message.success('添加成功')
      })
    },
    fetchOperaPermissionMember() {
      const id = this.currentNode.pk
      if (!id) return false
      ServiceTree.getperm(id).then(res => {
        this.readMembers = res.data.read_member.map(v => v.id)
        this.writeMembers = res.data.write_member.map(v => v.id)
      })
    },
    deleteOperaPermission(params) {
      const id = this.currentNode.pk
      masterApi.delete(id, params).then(res => {
        this.$message.success('删除成功')
      })
    },
    readMembersChange(val) {
      console.log('读改变2')
      const params = {
        read_member: val,
        write_member: []
      }
      this.addOperaPermission(params)
    },
    readMembersDelete(val) {
      console.log('读改变1')
      const params = {
        read_member: [val],
        write_member: []
      }
      this.deleteOperaPermission(params)
    },
    writeMembersChange(val) {
      console.log('写改变1')
      const params = {
        read_member: [],
        write_member: val
      }
      this.addOperaPermission(params)
    },
    writeMembersDelete(val) {
      console.log('写改变2')
      const params = {
        read_member: [],
        write_member: [val]
      }
      this.deleteOperaPermission(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.auth-manage {
    .group {
        &:first-child {
            margin-bottom: 20px;
        }
        label {
            display: inline-block;
            // width: 100px;
            font-size: 14px;
            margin-right: 20px;
        }
        .el-input {
            width: 300px;
        }
    }
    .names {
        width: 100%;
        border: 1px solid #ddd;
        height: 200px;
        box-sizing: border-box;
        margin-top: 20px;
        border-radius: 5px;
        padding: 10px;
    }
}
</style>
