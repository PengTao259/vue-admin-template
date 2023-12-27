<template>
  <div class="container">
    <div class="app-container">
      <!-- 新增权限按钮，传递id -->
      <template>
        <el-button
          class="btn-add"
          size="mini"
          type="primary"
          @click="add(0, 1)"
        >添加权限</el-button>
      </template>
      <el-table default-expand-all :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" size="mini" type="text" @click="add(row.id,2 )">添加</el-button>
            <el-button size="mini" type="text" @click="edit(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(row.id)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="`${showText}权限点`" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permission'
import { getChild } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 默认关闭
      },
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = getChild(await getPermissionList(), 0) // 将列表数据转化成树形结构
    },
    btnCancel() {
      this.showDialog = false
      // 清空内容
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 默认关闭
      }
    },
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('新增成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    add(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    edit(id) {
      getPermissionDetail(id).then(res => {
        this.formData = res
        this.showDialog = true
      })
    },
    del(id) {
      // 提示消息是否删除
      this.$confirm('是否删除该权限点', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPermission(id).then(() => {
          this.$message.success('删除成功')
          this.getPermissionList()
        })
      })
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
