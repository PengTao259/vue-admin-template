<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <!-- (自动上传)action是上传地址 人资项目不需要 人资项目(手动上传)  -->
    <!-- show-file-list不展示列表 -->
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 检查函数 判断文件的类型还有大小 return  true(继续上传)/false(停止上传)
    beforeAvatarUpload(file) {
      // jpeg png gif bmp

      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 1 // 5M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    uploadImage(params) {
      console.log(params)
      const cos = new COS({
        SecretId: 'AKIDZzDiz1qUgjZw62lG6jANM9xWr2ziDUXM', // 临时密钥服务需要的密钥对
        SecretKey: 'f1A7rNfvynOlwtc7RZS7ZopdP0NYZR9f' // 临时密钥服务需要的密钥
      }) // 完成cos初始化
      cos.putObject({
        Bucket: 'ceshishuju-1300524468', // 存储桶名称
        Region: 'ap-guangzhou', // 存储桶所在地域
        Key: params.file.name, // 文件名
        StorageClass: 'STANDARD', // 存储类型
        Body: params.file // 上传文件对象
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          this.$emit('input', 'http://' + data.Location)
        } else {
          this.$message.error(err.Message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
