<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table
        :data="tableData"
        class="gray-header"
      >
        <!-- 放置序号 -->
        <el-table-column width="50" label="序号">
          <template v-slot="{ $index }">
            {{ $index + 1 + (pageParams.page - 1) * pageParams.pagesize }}
          </template>
        </el-table-column>
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input
              v-if="row.editFlag"
              v-model="row.cacheData.name"
              size="mini"
            />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <template v-slot="{ row }">
            <el-switch
              v-if="row.editFlag"
              v-model="row.cacheData.state"
              :active-value="1"
              :inactive-value="0"
            />
            <span v-else>
              {{ row.state === 1 ? '启用' : row.state === 0 ? '禁用' : '无' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input
              v-if="row.editFlag"
              v-model="row.cacheData.description"
              size="mini"
              type="textarea"
            />
            <span v-else>{{ row.description }}</span>
          </template></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <template v-if="row.editFlag">
              <el-button size="mini" type="primary" @click="btnEditOk(row)">确定</el-button>
              <el-button size="mini" @click="editCancel(row)">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="text" @click="edit(row)">{{ row.editFlag === false ? '编辑': '确认' }}</el-button>
              <el-button
                size="mini"
                type="text"
                @click="del(row.id)"
              >删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置弹窗 -->
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item label="启用">
          <!-- 如果不需要校验 就不需要写 prop属性 -->
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" :disabled="isSubmitting" @click="btnOK">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, delRole, updateRole } from '@/api/role'
export default {
  name: 'RoleIndex',
  data() {
    return {
      // 表格数据
      showDialog: false,
      isSubmitting: false,
      tableData: [
      ],
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {

    // 获取角色列表
    async init() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.tableData = rows // 赋值数据
      this.pageParams.total = total
      this.tableData.forEach(item => {
        this.$set(item, 'editFlag', false) // 添加一个属性 初始值为false
        // 增加缓存数据
        this.$set(item, 'cacheData', {
          name: item.name,
          description: item.description,
          state: item.state
        })
      })
      return total
    },
    // 切换分页时 请求新的数据
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.init() // 重新请求数据
    },
    btnOK() {
      if (this.isSubmitting) {
        return // 如果正在提交，则直接返回，不执行后续代码
      }
      this.isSubmitting = true // 开始提交
      this.$refs.roleForm.validate(isOK => {
        if (isOK) {
          addRole(this.roleForm).then(res => {
            this.$message.success('添加角色成功')
            // 更新数据获取最新总页数 添加数据后跳转到最后一页
            this.init().then(total => {
              this.pageParams.page = Math.ceil(total / this.pageParams.pagesize)
              this.changePage(this.pageParams.page)
            })
            this.btnCancel()
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.isSubmitting = false // 提交结束
          })
        }
      })
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      }
      this.$refs.roleForm.resetFields() // 重置表单数据
      this.showDialog = false // 关闭弹层
    },
    del(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRole(id)
        this.$message.success('删除角色成功')
        // 如果删除的是当前页的最后一条数据，那么页码减1
        if (this.tableData.length === 1 && this.pageParams.page > 1) {
          this.pageParams.page--
        }
        this.init()
      }).catch(err => {
        console.log(err)
      })
    },
    edit(row) {
      row.editFlag = true // 找到当前行 设置为true
      row.cacheData = {
        name: row.name,
        description: row.description,
        state: row.state
      }
    },
    editCancel(row) {
      row.editFlag = false // 找到当前行 设置为false
    },
    btnEditOk(row) {
      console.log(row, 'row')
      if (row.cacheData.name && row.cacheData.description) {
        // 发送请求修改角色并且提示更新成功
        updateRole({
          id: row.id,
          ...row.cacheData
        }).then(() => {
          this.$message.success('更新角色成功')
          Object.assign(row, {
            ...row.cacheData,
            editFlag: false
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message.error('角色名称和角色描述不能为空')
      }
    }
  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
