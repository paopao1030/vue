<template>
  <el-form label-width="80px" v-show="visible">
    <el-form-item label="spu名称">
      <el-input
        placeholder="请输入品牌名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="tm in trademarkList"
          :key="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="spu描述">
      <el-input
        type="textarea"
        rows="5"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :file-list="spuImageList"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
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
      <el-select placeholder="请选择品牌">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%">
        <el-table-column type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="180">
        </el-table-column>
        <el-table-column label="属性值名称列表" prop="name">
          <template slot-scope="{ row, $index }">
            <el-tag
              style="margin-right:5px"
              v-for="(value, index) in row.spuSaleAttrValueList"
              :key="value.id"
              closable
              :disable-transitions="false"
            >
              {{ value.saleAttrValueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button>返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuId: "",
      spuInfo: {
        spuName: "",
        description: "",
        tmId: "",
        spuSaleAttrList: [], // 必须有初始空数组
        spuImageList: [] // spu销售属性的数组
      },
      //初始页面需要的数据
      spuImageList: [],
      trademarkList: [],
      saleAttrList: []
    };
  },
  methods: {
    //修改spu的数据请求（父调用）
    initUpdate(id) {
      this.spuId = id;
      this.getSpuInfo();
      this.getSpuImageList();
      this.getTrademarkList();
      this.getSaleAttrList();
    },
    //新增页面的数据请求（父调用）
    initLoadAddData(category3Id) {
      this.spuInfo.category3Id = category3Id;
      this.getTrademarkList();
      this.getSaleAttrList();
    },
    //根据id获取spu页面信息
    async getSpuInfo() {
      let result = await this.$API.spu.get(this.spuId);
      if (result.code === 200) {
        this.spuInfo = result.data;
      }
    },
    //根据id获取spu图片信息
    async getSpuImageList() {
      const result = await this.$API.sku.getSpuImageList(this.spuId);
      const spuImageList = result.data;
      spuImageList.forEach(item => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = spuImageList;
    },
    //请求品牌list展示页面
    async getTrademarkList() {
      const result = await this.$API.trademark.getAllList();
      if (result.code === 200) {
        this.trademarkList = result.data;
      }
    },
    //获取所有销售属性
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    },
    //放大照片的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //删除照片的回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    //照片上传成功的回掉
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
