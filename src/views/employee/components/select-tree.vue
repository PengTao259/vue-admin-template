<template>
  <!-- element-ui级联组件 -->
  <el-cascader
    :value="value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>
<script>
import { getDepartmentList } from '@/api/department'
import { getChild } from '@/utils'
export default {
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [], // 赋值给 级联组件的options
      props: {
        label: 'name', // 要展示的字段
        value: 'id' // 要存储的字段
      }
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    changeValue(data) {
      if (data.length > 0) {
        this.$emit('input', data[data.length - 1])
      } else {
        this.$emit('input', null)
      }
    },
    async getDepartmentList() {
      this.treeData = getChild(await getDepartmentList(), 0) // 将组织架构的数据 转化树形赋值给treeData
    }
  }
}
</script>
