<template>
  <div class="pagination">
    <!-- 当前页码为1时不能操作 -->
    <button :disabled="myCurrentPage === 1">上一页</button>
    <!-- start要大于1才显示 -->
    <button v-if="startEnd.start > 1">1</button>
    <!-- start要大于2才显示 -->
    <button disabled v-if="startEnd.start > 2">···</button>

    <!-- 连续页码 [start, end] -->
    <button v-for="num in startEnd.end" v-if="num < startEnd.start">
      {{ num }}
    </button>
    <!-- 
      v-for的优先级高于v-if: 先执行v-f
      or的遍历, 每遍历一个再进行v-if的判断  面试题
    -->
    <!-- 只有在end小于totalPages-1 -->
    <button disabled v-if="startEnd.end < totalPages - 1">···</button>
    <!-- 只有在end小于totalPages -->
    <button v-if="startEnd.end < totalPages">{{ totalPages }}</button>
    <!-- 当当前页码为totalPages时不能操作 -->
    <button :disabled="myCurrentPage === totalPages">下一页</button>

    <button style="margin-left: 30px" disabled>共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    // currentPage: 当前页码
    currentPage: {
      type: Number,
      default: 1,
    },
    // pageSize: 每页数量
    pageSize: {
      type: Number,
      default: 10,
    },
    // total: 总数量
    total: {
      type: Number,
      default: 0,
    },
    // showPageNo: 连续数码数
    showPageNo: {
      type: Number,
      default: 5, // 最好指定为奇数
    },
  },
  data() {
    return {
      //当前页码是外界传进来的
      myCurrentPage: this.currentPage,
    };
  },
  computed: {
    //计算属性的总页数，根据总数/一页多少数据算出
    totalPages() {
      const { total, pageSize } = this;
      return Math.ceil(total / pageSize);
    },
    //计算出起始的页码
    startEnd() {
      let start, end;
      // 取出依赖数据 myCurrentPage / showPageNo / totalPages
      const { myCurrentPage, showPageNo, totalPages } = this;
      start = myCurrentPage - Math.floor(showPageNo / 2);
      if (start < 1) {
        start = 1;
      }
      end = myCurrentPage + Math.floor(showPageNo / 2);
      // start + showPageNo - 1;
      if (end > totalPages) {
        end = totalPages;
        // start = end - showPageNo + 1;
        // 如果start小于1, 修正为1
        if (start < 1) {
          start = 1;
        }
      }
      return { start, end };
      console.log(start, end);
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.pagination {
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
