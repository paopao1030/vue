<template>
  <h1>我是一个spu组件</h1>
</template>

<script>
export default {
  data() {
    return {
      spuInfo: {},
      spuImageList: [],
      trademarkList: [],
      saleAttrList: []
    };
  },
  methods: {
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
    //获取销售属性的列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    }
  }
};
</script>

<style></style>
