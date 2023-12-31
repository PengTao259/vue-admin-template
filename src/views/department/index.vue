<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree :expand-on-click-node="false" default-expand-all :data="depts" :props="defaultProps">
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template -->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event 实参 表示类型 -->
              <el-dropdown @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层 -->
    <!-- 表示会接受子组件的事件  update:showDialog, 值 => 属性 -->
    <add-dept ref="adddept" :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @updateDepartment="init" />
  </div>
</template>
<script>
import { getDepartmentList, delDepartment } from '@/api/department'
import { getChild } from '@/utils'
import AddDept from './components/add-dept.vue'
import { Message } from 'element-ui'
export default {
  name: 'Department',
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, // 存储当前点击的id
      showDialog: false, // 控制弹层的显示和隐藏
      depts: [], // 数据属性
      defaultProps: {
        label: 'name', // 要显示的字段的名字
        children: 'children' // 读取子节点的字段名
      }
    }
  },
  created() {
    this.init() // 调用获取数据的接口
  },
  methods: {
    // 封装好方法
    async init() {
      const result = await getDepartmentList()
      // 列表数据转换成树形结构
      this.depts = getChild(result, 0)
    },
    // 操作部门方法
    operateDept(type, id) {
      if (type === 'add') {
        // 添加子部门
        this.showDialog = true // 显示弹层
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 编辑部门
        this.showDialog = true // 显示弹层
        this.currentNodeId = id
        this.$nextTick(() => {
          // 通过id获取部门详情
          this.$refs.adddept.getDepartmentDetail()
        })
      } else if (type === 'del') {
        // 删除部门
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 确认删除
          await delDepartment(id)
          this.init()
          Message.success('删除成功')
        }).catch(() => {
          // 取消删除
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 100px;
  display: inline-block;
  margin: 10px;
}

</style>
