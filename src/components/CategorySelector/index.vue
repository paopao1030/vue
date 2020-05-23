<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          :disabled="disabled"
          v-model="cForm.category1Id"
          placeholder="请选择一级分类"
          @change="handleChange1"
        >
          <el-option
            v-for="c in category1List"
            :label="c.name"
            :value="c.id"
            :key="c.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="disabled"
          v-model="cForm.category2Id"
          placeholder="请选择二级分类"
          @change="handleChange2"
        >
          <el-option
            :label="c2.name"
            v-for="c2 in category2List"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择三级分类"
          @change="handleChange3"
          :disabled="disabled"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      disabled: false,
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      category1List: [], // 一级分类列表
      category2List: [], // 二级分类列表
      category3List: [] // 三级分类列表
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    //一级下拉框的值发生变化,请求二级列表，并发送给父组件改变的数据
    async handleChange1(category1Id) {
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      const result = await this.$API.category.getCategorys2(category1Id);
      this.category2List = result.data;
      this.$emit("categoryChange", { categoryId: category1Id, level: 1 });
    },
    //二级下拉框的值发生变化
    async handleChange2(category2Id) {
      this.cForm.category3Id = "";
      this.category3List = [];
      const result = await this.$API.category.getCategorys3(category2Id);
      this.category3List = result.data;
      this.$emit("categoryChange", { categoryId: category2Id, level: 2 });
    },
    //三级下拉框的值发生变化，并发送给父组件改变的数据
    handleChange3(category3Id) {
      this.$emit("categoryChange", { categoryId: category3Id, level: 3 });
    },
    //获取一级列表
    async getCategory1List() {
      const result = await this.$API.category.getCategorys1();
      this.category1List = result.data;
    },
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
