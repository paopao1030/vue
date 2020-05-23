<template>
  <div>
    <CategorySelector ref="cs" @categoryChange="handleCategoryChange" />
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
                <el-popconfirm
                  :title="`确定要删除${row.attrName}`"
                  @onConfirm="deleteAttr(row.id)"
                >
                  <HintButton
                    slot="reference"
                    title="删除"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                  ></HintButton>
                </el-popconfirm>
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
                :ref="$index"
                v-if="row.edit"
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性值名称"
                @blur="toShow(row)"
                @keyup.enter.native="toShow(row)"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定要删除${row.valueName}`"
                @onConfirm="attr.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attr.attrName || attr.attrValueList.length === 0"
          >保存</el-button
        >
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
  watch: {
    isShowList(value) {
      this.$refs.cs.disabled = !value;
    }
  },
  methods: {
    //删除一个属性
    async deleteAttr(id) {
      let result = await this.$API.attr.remove(id);
      if (result.code === 200) {
        this.getAttrs();
      } else {
        this.$message("删除属性失败");
      }
    },
    //添加或者修改属性值
    async save() {
      const attr = this.attr;
      //对传送的数值进行判断
      attr.attrValueList = attr.attrValueList.filter(item => {
        return item.valueName !== "" && delete item.edit;
      });
      if (attr.attrValueList.length === 0) {
        this.$message.warning("至少输入一个属性!");
        return;
      }
      let result = await this.$API.attr.addOrUpdate(attr);
      if (result.code === 200) {
        this.$message.success("属性保存成功");
        this.isShowList = true;
        this.getAttrs();
      } else {
        this.$message.error("保存属性失败");
      }
    },
    //查看模式改为编辑模式
    toEdit(value, index) {
      // 如果value就已经有edit属性了, 直接指为true
      if (value.hasOwnProperty("edit")) {
        value.edit = true;
      } else {
        // 如果没有, 必须通过$set()来添加一个新属性
        this.$set(value, "edit", true);
      }
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
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
    //添加一个新的属性值
    addAttrValue() {
      this.attr.attrValueList.push({
        attrId: this.attr.id,
        valueName: "",
        edit: true
      });
      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length - 1].focus();
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
    //获取属性列表
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
