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
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="tm in trademarkList"
          :key="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="SPU描述"
        rows="4"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
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
      <el-select
        :placeholder="
          unUsedSaleAttrList.length > 0
            ? `还有${unUsedSaleAttrList.length}个属性未选择`
            : '没有啦!'
        "
        value=""
        v-model="attriDName"
      >
        <el-option
          :label="item.name"
          :value="item.id + ':' + item.name"
          v-for="item in unUsedSaleAttrList"
          :key="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addSpuSaleAttr"
        :disabled="!attriDName"
        >添加销售属性</el-button
      >
      <el-table border style="margin-top:20px" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"> </el-table-column>
        <el-table-column label="属性值名称列表" prop="name">
          <template slot-scope="{ row, $index }">
            <el-tag
              style="margin-right:5px"
              v-for="(value, index) in row.spuSaleAttrValueList"
              :key="value.id"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ value.saleAttrValueName }}
            </el-tag>
            <el-input
              style="width:100px"
              placeholder="请输入"
              v-if="row.edit"
              v-model="row.saleAttrValueName"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+ 添加</el-button
            >
            <!-- @click="showInput" -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="{ row, $index }">
            <el-popconfirm
              title="你确定要删除这个属性吗?"
              @onConfirm="spuInfo.spuSaleAttrList.splice($index, 1)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">返回</el-button>
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
      spuImageList: [],
      trademarkList: [],
      saleAttrList: [],
      attriDName: "" //销售input里存储的id和name值
    };
  },
  computed: {
    unUsedSaleAttrList() {
      //先拿到所有spuinfo里的属性值和sale里的属性值不一样的,再过滤出来,拿到不一样的
      return this.saleAttrList.filter(item =>
        this.spuInfo.spuSaleAttrList.every(
          spu => spu.saleAttrName !== item.name
        )
      );
    }
  },
  methods: {
    //保存或者更新spu属性
    async save() {
      const { spuInfo, spuImageList } = this;
      //处理img列表
      spuInfo.spuImageList = spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.url
      }));
      //处理销售属性对象
      spuInfo.spuSaleAttrList.filter(item => {
        //清除不必要的后台不接收数据
        delete item.edit;
        delete item.saleAttrValueName;
        return item.spuSaleAttrValueList.length > 0;
      });
      const result = await this.$API.spu.addUpdate(spuInfo);
      // 成功了, ...
      if (result.code === 200) {
        this.$message.success("保存SPU成功");
        //重置数据并展现上次看的页码，重新请求页面
        this.resetDate();
        this.$emit("update:visible", false);
        this.$emit("saveSuccess");
      } else {
        // 失败了, 提示
        this.$message.error("保存SPU失败");
      }
    },
    //保存后把原本收集的数据清空
    resetDate() {
      this.dialogImageUrl = "";
      this.dialogVisible = false;

      this.spuId = null;
      this.spuInfo = {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: []
      };
      this.spuImageList = [];
      this.trademarkList = [];
      this.saleAttrList = [];
      this.attriDName = "";
    },
    //销售属性值的收集
    handleInputConfirm(spu) {
      const { saleAttrValueName, baseSaleAttrId } = spu;
      if (!saleAttrValueName) {
        spu.edit = false;
        return;
      }
      const isRePeat = spu.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === saleAttrValueName;
      });
      if (isRePeat) {
        this.$message.error("数据已重复,请重新输入");
        spu.saleAttrValueName = "";
        return;
      }
      spu.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName
      });
      spu.edit = false;
      spu.saleAttrValueName = "";
    },
    //点击添加+显示input输入框并收集数据
    showInput(spu) {
      if (spu.hasOwnProperty("edit")) {
        spu.edit = true;
      } else {
        this.$set(spu, "edit", true);
      }
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //点击添加销售属收集input数据(销售属性名)
    addSpuSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attriDName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      });
      this.attriDName = "";
    },
    //照片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //照片删除的回调a
    handleRemove(file, fileList) {
      console.log("照片删除了");
      this.spuImageList = fileList;
    },
    //点击图片放大时的回调
    handlePictureCardPreview(file) {
      //保存大图的url地址并显示
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //添加spu时展现的需要品牌和销售属性
      initLoadAddData (category3Id) {
      // 保存到spuInfo中
      this.spuInfo.category3Id = category3Id
      // 3. 获取所有品牌的列表
      this.getTrademarkList()
      // 4. 获取所有销售属性(id/name)列表
      this.getSaleAttrList()
    },
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
      const spuImageList = result.data;
      spuImageList.forEach(item => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = spuImageList;
    },
    //获取所有品牌列表
    async getTrademarkList() {
      const result = await this.$API.trademark.getAllList();
      if (result.code === 200) {
        this.trademarkList = result.data;
      }
    },

    /*
    获取所有销售属性(id/name)列表
    */
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    },

    //回到spu列表界面,重置data数据
    back() {
      this.$emit("update:visible", false);
      this.resetDate();
      this.$emit("cancel");
    }
  }
};
</script>

<style></style>
