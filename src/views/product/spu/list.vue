<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <category-selector @categoryChange="categoryChange"></category-selector>
    </el-card>
    <el-card>
      <div v-show="!isShowSpu && !isShowSku">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:15px"
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
                @click="updateSku(row.index)"
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
      <!-- <spuForm ref="spuform" v-show="isShowSpu" :visible.sync="isShowSpu" /> -->
      <spu ref="spuform" v-show="isShowSpu" :visible.sync="isShowSpu" />
      <skuForm v-show="isShowSku" />
    </el-card>
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
      spuList: []
    };
  },
  mounted() {
    this.category3Id = 61;
    this.getSpuList();
  },
  name: "SpuList",
  methods: {
    //显示修改spu页面
    updateSpu(spuid) {
      this.isShowSpu = true;
      this.$refs.spuform.initUpdate(spuid);
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
