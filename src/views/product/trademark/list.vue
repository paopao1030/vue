<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="dialogShow"
      >添加</el-button
    >
    <template>
      <el-table
        ref="singleTable"
        :data="trademarks"
        stripe
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="80" label="序号" align="center">
        </el-table-column>
        <el-table-column property="tmName" label="品牌名称" width="320">
        </el-table-column>
        <el-table-column property="logoUrl" label="品牌Logo">
          <template slot-scope="{ row }">
            <img :src="row.logoUrl" style="width:100px;heigth=80px" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button type="warn" icon="el-icon-edit" @click="showUpdata(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteOne(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="text-align:center;margin-top:50px"
        :current-page="page"
        :page-sizes="[3, 6, 9, 12]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getTrademarks"
        @size-change="handleSizeChange"
      >
      </el-pagination>
      <el-dialog
        :title="form.id ? '更新' : '添加'"
        :visible.sync="isShowDialog"
      >
        <el-form :model="form">
          <el-form-item label="品牌名称" label-width="120px">
            <el-input
              v-model="form.tmName"
              autocomplete="off"
              placeholder="请输入品牌名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" label-width="120px">
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="okOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trademarks: [], // 当前页的列表数据
      total: 0, // 总数量
      page: 1, // 当前页码
      limit: 3, // 每页数量
      isShowDialog: false, //是否dialog显示
      form: {
        tmName: "",
        logoUrl: ""
      }
    };
  },
  mounted() {
    this.getTrademarks(2);
  },
  methods: {
    //删除品牌
    deleteOne(trademark) {
      this.$confirm(`确定删除${trademark.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const result = await this.$API.trademark.remove(trademark.id);
          if (result.code === 200) {
            this.$message.success("删除品牌成功");
            const page =
              this.trademarks.length === 1 ? this.page - 1 : this.page;
            this.getTrademarks(page);
          } else {
            this.$message.error("删除品牌失败,请检查");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改品牌数据
    showUpdata(trademark) {
      this.form = trademark;
      this.isShowDialog = true;
    },
    //点击确新增品牌或者修改品牌
    async okOrUpdate() {
      const trademark = this.form;
      let result;
      if (trademark.id) {
        result = await this.$API.trademark.update(trademark);
      } else {
        result = await this.$API.trademark.add(trademark);
      }
      if (result.code === 200) {
        this.$message.success(`${trademark.id ? "修改" : "新增"}品牌成功`);
        this.isShowDialog = false;
        //如果是新增展示第一页,如果是修改展示当前页
        this.getTrademarks(trademark.id ? this.page : 1);
      } else {
        this.$message.error(`${trademark.id ? "修改" : "新增"}品牌失败`);
      }
    },
    //点击添加按钮
    dialogShow() {
      this.form = {
        tmName: "",
        logoUrl: ""
      };
      this.isShowDialog = true;
    },
    //传照片成功后的回调
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data;
    },
    //上传照片之前的回调,判断图片的格式和大小
    beforeAvatarUpload(file) {
      const isJPGOrPNG = ["image/jpeg", "image/png"].indexOf(file.type) >= 0;
      const isLt2M = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      }
      return isJPGOrPNG && isLt2M;
    },
    //异步获取品牌列表
    async getTrademarks(page) {
      this.page = page;
      this.loading = true;
      const result = await this.$API.trademark.getAllList(page, this.limit);
      this.loading = false;
      if (result.code === 200) {
        let { records, total } = result.data;
        this.trademarks = records;
        this.total = total;
      } else {
        this.$message.error("获取品牌列表失败!");
      }
    },
    //改变按钮时的重新请求页码列表
    handleSizeChange(pagesize) {
      this.limit = pagesize;
      this.getTrademarks(1);
    }
  },
  name: "TrademarkList"
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
