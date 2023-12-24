<template>
  <div>
    <!-- 修改密码弹窗 -->
    <!-- 监听dialog关闭事件 -->
    <el-dialog
      append-to-body
      title="修改密码"
      :visible.sync="dialogTableVisible"
      width="30%"
      @close="btnCancel"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnCancel('form')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('form')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'

export default {
  name: 'ResetPassword',
  data() {
    return {
      dialogTableVisible: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // 校验规则
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          // 配置自定义校验规则
          { validator: this.validatePass, trigger: 'blur' },
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetPassword() {
      this.dialogTableVisible = true
    },
    // 自定义校验规则
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // const { oldPassword, newPassword } = this.form
          const { data } = await updatePassword(this.form)
          if (data.code === 200) {
            // 重置表单
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // this.btnCancel(formName)
            // 密码修改成功后，通知父组件退出登录
            this.$emit('logout')
          }
        } else {
          console.log('校验失败')
          return false
        }
      })
    },
    btnCancel(formName) {
      this.$refs[formName].resetFields()
      this.dialogTableVisible = false
    }
  }
}
</script>
