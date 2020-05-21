<template>
  <div>
    <CategorySelector @categoryChange="handleCategoryChange" />
    <el-card class="box-card">
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="showAdd"
          >添加属性</el-button
        >
        <template>
          <el-table :data="attrs" stripe style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="属性名称"
              width="180"
              prop="attrName"
            ></el-table-column>
            <el-table-column label="属性值列表">
              <template slot-scope="{ row, $index }">
                <el-tag
                  style="margin: 2px"
                  type="info"
                  v-for="value in row.attrValueList"
                  :key="value.id"
                  >{{ value.valueName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="150">
              <template slot-scope="{ row }">
                <HintButton
                  title="修改"
                  type="warn"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showUpdata(row)"
                ></HintButton>
                <HintButton
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></HintButton>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div v-show="!isShowList">
        <el-form inline :model="attr">
          <el-form-item label="属性名">
            <el-input
              type="text"
              v-model="attr.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table border style="margin:20px 0" :data="attr.attrValueList">
          <el-table-column label="序号" width="80" align="center" type="index">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.edit"
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性值名称"
                @blur="toShow(row)"
                @keyup.enter.native="toShow(row)"
              ></el-input>
              <span v-else @click="toEdit(row)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="attr.attrValueList.splice($index, 1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  mounted() {
    this.category1Id = 2;
    this.category2Id = 13;
    this.category3Id = 61;
    this.getAttrs();
  },
  name: "AttrList",
  methods: {
    //查看模式改为编辑模式
    toEdit(value) {
      // 如果value就已经有edit属性了, 直接指为true
      if (value.hasOwnProperty("edit")) {
        value.edit = true;
      } else {
        // 如果没有, 必须通过$set()来添加一个新属性
        this.$set(value, "edit", true);
      }
    },
    //编辑模式失去焦点或者回车改为查看模式
    toShow(value) {
      if (value.valueName) {
        const isReape = this.attr.attrValueList.some(item => {
          if (item !== value) {
            return item.valueName === value.valueName;
          }
        });
        if (!isReape) {
          value.edit = false;
        } else {
          value.valueName = "";
          this.$message.warning("这个属性已经存在了!");
        }
      }
    },
    //点击添加属性的界面
    showAdd() {
      this.attr = {
        // 要添加或者修改的平台属性对象
        attrName: "", // 属性名
        attrValueList: [], //属性值的列表
        categoryId: this.category3Id, // 3级的分类ID
        categoryLevel: 3 // 只能是3级
      };
      this.isShowList = false;
    },
    //修改属性值
    showUpdata(attr) {
      this.attr = attr;
      this.isShowList = false;
    },
    //添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({
        valueName: "",
        edit: true
      });
    },
    //子组件三个级别发生变化传回来的参数
    handleCategoryChange({ categoryId, level }) {
      if (level === 1) {
        //发送一级信息时，重置二级三级，并把展示数组改为【】
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.attrs = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.attrs = [];
      } else {
        this.category3Id = categoryId;
        // 异步请求获取属性列表显示
        this.getAttrs();
      }
    },
    async getAttrs() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrs = result.data;
    }
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrs: [],
      isShowList: true, //true为列表页面，false为添加修改页面
      attr: {
        // 要添加或者修改的平台属性对象
        attrName: "", // 属性名
        attrValueList: [], //属性值的列表
        categoryId: "", // 3级的分类ID
        categoryLevel: 3 // 只能是3级
      }
    };
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
