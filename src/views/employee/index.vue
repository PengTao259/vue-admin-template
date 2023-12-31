<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeKeyword"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          :data="depts"
          :props="defaultProps"
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button
            v-permission="'add-employee'"
            size="mini"
            type="primary"
            @click="$router.push('/employee/detail')"
          >添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmp">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table
          ref="form"
          v-loading="loading"
          :data="list"
        >
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button
                size="mini"
                type="text"
                @click="$router.push(`/employee/detail/${row.id}`)"
              >查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm title="确认删除该行数据吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getTableList" />
    <el-dialog
      :visible.sync="showRoleDialog"
      title="分配角色"
      @close="showRoleDialog = false"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="mini"
            type="primary"
            @click="btnOk()"
          >确认</el-button>
          <el-button
            size="mini"
            @click="showRoleDialog = false"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import { exportEmployee, getEmployeeList, delEmployee, getRoleList, getEmployeeDetail, assignRole } from '@/api/employee'
import { getChild } from '@/utils'
import fileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      departmentList: [],
      list: [],
      loading: false,
      showExcelDialog: false, // 控制excel的弹层显示和隐藏
      showRoleDialog: false, // 控制角色的弹层显示和隐藏
      // 树组件内容
      depts: [], // 数据属性
      defaultProps: {
        label: 'name', // 要显示的字段的名字
        children: 'children' // 读取子节点的字段名
      },
      // 查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: '' // 模糊搜索字段
      },
      total: 0, // 记录员工的总数
      roleList: [], // 角色列表
      roleIds: [], // 选中的角色id
      currentEmpId: null // 当前员工的id
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 删除员工方法
    async confirmDel(id) {
      await delEmployee(id)
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getTableList()
      this.$message.success('删除员工成功')
    },
    async init() {
      // 递归方法 将列表转化成树形
      this.depts = getChild(await getDepartmentList(), 0)
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点
      // 树组件渲染是异步的 等到更新完毕
      this.$nextTick(() => {
        // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 这个时候参数 记录了id
      this.getTableList()
    },
    // 获取员工列表的方法
    async getTableList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.total = total
      this.list = rows
      this.loading = false
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id // 重新记录了参数
      this.queryParams.page = 1 // 设置第一页
      this.getTableList()
    },
    // 切换页码
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getTableList() // 查询数据
    },
    changeKeyword() {
      // 单位时间内只执行最后一次
      // this的实例上赋值了一个timer的属性
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getTableList()
      }, 400)
    },
    // 导出员工
    async exportEmp() {
      const res = await exportEmployee()
      fileSaver.saveAs(res, '员工列表.xlsx')
    },
    // 分配角色
    async btnRole(id) {
      this.roleList = await getRoleList(id)
      this.currentEmpId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog = true
    },
    async btnOk() {
      await assignRole({
        id: this.currentEmpId,
        roleIds: this.roleIds
      })
      this.showRoleDialog = false
      this.$message.success('分配角色成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}</style>
