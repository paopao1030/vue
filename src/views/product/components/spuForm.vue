<template>
  <el-form label-width="100px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="value" placeholder="请选择品牌" value="">
        <el-option
          v-for="item in trademarkList"
          :key="item.id"
          :value="item.tmName"
        >
          {{ item.tmName }}</el-option
        >
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="SPU名称"
        rows="4"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="true"
        class="upload-demo"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select placeholder="请选择" value="">
        <el-option
          :label="item.name"
          :value="item.id"
          v-for="item in saleAttrList"
          :key="item.id"
        >
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <el-table border style="margin-top:20px" :data="saleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性名" prop="name"> </el-table-column>
        <el-table-column label="属性值名称" prop="name"> </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="{ row, $index }">
            <hint-button
              title="删除"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></hint-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],

      value: "长虹",
      dialogImageUrl: "",
      dialogVisible: false,
      spuId: "",
      spuInfo: {},
      spuImageList: [],
      trademarkList: [],
      saleAttrList: []
    };
  },
  methods: {
    //父组件调用的方法,根据请求加载初始化数据
    initUpdate(id) {
      this.spuId = id;
      this.getSpuInfo();
      this.getSpuImageList();
      this.getTrademarkList();
      this.getSaleAttrList();
    },
    ////根据id获取spu页面信息
    async getSpuInfo() {
      let result = await this.$API.spu.get(this.spuId);
      if (result.code === 200) {
        this.spuInfo = result.data;
      }
    },
    //根据id获取spu图片信息
    async getSpuImageList() {
      const result = await this.$API.sku.getSpuImageList(this.spuId);
      this.spuImageList = result.data;
      let a = result.data.filter(item => {
        return { name: item.imgName, url: item.imgUrl };
      });
      this.spuImageList = a;
    },
    //获取所有品牌列表
    async getTrademarkList() {
      const result = await this.$API.trademark.getAllList();
      this.trademarkList = result.data;
    },

    /*
    获取所有销售属性(id/name)列表
    */
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    },

    //回到spu列表界面
    back() {
      this.$emit("update:visible", false);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style></style>
