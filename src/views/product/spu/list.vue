<template>
  <div>
    <el-card style="margin-bottom: 20px" v-show="!isShowSku">
      <category-selector
        ref="cs"
        @categoryChange="categoryChange"
      ></category-selector>
    </el-card>
    <el-card>
      <div v-show="!isShowSpu && !isShowSku">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom:15px"
          @click="showAddSpu"
          :disabled="!category3Id"
          >添加spu</el-button
        >
        <el-table border :data="spuList">
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column label="SPU名称" prop="spuName"> </el-table-column>
          <el-table-column label="SPU描述" prop="description">
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="{ row, $index }">
              <hint-button
                @click="showSkuAdd(row)"
                title="添加SKU"
                type="primary"
                icon="el-icon-plus"
                size="mini"
              ></hint-button>
              <hint-button
                @click="updateSpu(row.id)"
                title="修改SPU"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></hint-button>
              <hint-button
                title="查看所有SKU"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="getSkuList(row)"
              ></hint-button>
              <hint-button
                title="删除SPU"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="text-align: center; margin-top: 20px;"
          :current-page="page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- <spuForm
        ref="spuform"
        v-show="isShowSpu"
        :visible.sync="isShowSpu"
        @saveSuccess="handelSaveSuccess"
        @cancel="handelCancel"
      /> -->
      <spu v-show="isShowSpu" ref="spu" :visible.sync="isShowSpu" />
      <skuForm
        ref="skuform"
        v-show="isShowSku"
        :saveSuccess="() => (isShowSku = false)"
        @cancel="isShowSku = false"
      />
    </el-card>
    <el-dialog title="收货地址" :visible.sync="isShowSkuList">
      <el-table :data="skuList">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格（元）"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量（kg）"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width:100px;heigth:100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import skuForm from "../components/skuForm";
import spuForm from "../components/spuForm";
import spu from "../components/spu";
export default {
  components: {
    skuForm,
    spuForm,
    spu
  },
  watch: {
    isShowSpu(value) {
      this.$refs.cs.disabled = value;
    }
  },
  data() {
    return {
      isShowSpu: false,
      isShowSku: false,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      total: 0,
      spuList: [],
      isShowSkuList: false,
      spu: {},
      skuList: []
    };
  },
  mounted() {
    this.category1Id = 2;
    this.category2Id = 13;
    this.category3Id = 61;
    this.getSpuList();
  },
  name: "SpuList",
  methods: {
    //获取当前spu的sku
    async getSkuList(spu) {
      this.isShowSkuList = true;
      this.spu = spu;
      let result = await this.$API.sku.getListBySpuId(spu.id);
      if (result.code === 200) {
        this.skuList = result.data;
      }
    },
    //spu如果保存好了数据
    handelSaveSuccess() {
      this.getSpuList(this.spuId ? this.page : 1);
      this.spuId = null;
    },
    //spu取消了返回本页面
    handelCancel() {
      this.spuId = null;
    },
    /*
    显示SKU添加的表单界面
    */
    showSkuAdd(spu) {
      this.isShowSku = true;

      spu = { ...spu }; // 对spu进行浅拷贝, 以免更新列表中数据对象
      spu.category1Id = this.category1Id;
      spu.category2Id = this.category2Id;

      // 让skuForm去请求加载初始显示需要的数据
      this.$refs.skuform.initLoadAddData(spu);
    },
    /*
    显示SPU的添加界面
    */
    showAddSpu() {
      // 显示SpuForm修改界面
      this.isShowSpu = true;
      // 通知SpuForm请求添加界面初始数据显示
      // this.$refs.spuform.initLoadAddData(this.category3Id);
      this.$refs.spu.initLoadAddData(this.category3Id);
    },
    //显示修改spu页面
    updateSpu(spuid) {
      this.spuId = spuid;
      this.isShowSpu = true;
      // this.$refs.spuform.initUpdate(spuid);
      this.$refs.spu.initUpdate(spuid);
    },
    //三级列表传递的值更改父组件的值
    categoryChange({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        (this.spuList = []), (this.total = 0);
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        (this.spuList = []), (this.total = 0);
      } else {
        this.category3Id = categoryId;
        // 请求获取分页列表数据
        this.getSpuList();
      }
    },
    //获取页面列表
    async getSpuList(page = 1) {
      this.page = page;
      const { limit, category3Id } = this;
      let result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        const { records, total } = result.data;
        this.spuList = records;
        this.total = total;
      }
    },
    //页面发生改变
    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getSpuList(1);
    }
  }
};
</script>
