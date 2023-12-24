<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table
        :data="tableData"
      >
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色" />
        <el-table-column prop="state" align="center" width="200" label="启用">
          <template v-slot="{ row }">
            {{ row.state === 1 ? '启用' : row.state === 0 ? '禁用' : '无' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button size="mini" type="primary" @click="edit(row.id)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination layout="prev, pager, next" />
      </el-row>
    </div>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      // 表格数据
      tableData: [
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 获取角色列表
    async init() {
      const { rows } = await getRoleList()
      console.log(rows[0])
      this.tableData = rows
    }
  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
