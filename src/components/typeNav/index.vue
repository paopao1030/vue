<template>
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="hideCategory" @mouseenter="showCategory">
        <h2 class="all">全部商品分类</h2>
        <transition name="move">
        <div class="sort" v-show="isShowFirst">
          <div class="all-sort-list2" @click="toSearch">
            <div
              class="item"
              v-for="(list, index) in newList"
              :key="list.categoryId"
              :class="{ item_on: index === currentIndex }"
              @mouseenter="showSubCategorys(index)"
            >
              <h3>
                <a
                  href="javascript:"
                  :data-categoryName="list.categoryName"
                  :data-category1Id="list.categoryId"
                  >{{ list.categoryName }}</a
                >
              </h3>
              <div class="item-list clearfix">
                <div class="subitem">
                  <dl
                    class="fore"
                    v-for="c2 in list.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dt>
                      <a
                        href="javascript:"
                        :data-categoryName="c2.categoryName"
                        :data-category2Id="c2.categoryId"
                        >{{ c2.categoryName }}</a
                      >
                    </dt>
                    <dd>
                      <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                        <a
                          href="javascript:"
                          :data-categoryName="c3.categoryName"
                          :data-category3Id="c3.categoryId"
                          >{{ c3.categoryName }}</a
                        >
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="javascript:">服装城</a>
        <a href="javascript:">美妆馆</a>
        <a href="javascript:">尚品汇超市</a>
        <a href="javascript:">全球购</a>
        <a href="javascript:">闪购</a>
        <a href="javascript:">团购</a>
        <a href="javascript:">有趣</a>
        <a href="javascript:">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import { mapState } from "vuex";
export default {
  name: "TypeNav",

  data() {
    return {
      // -2: 代表完全在整个div外面  -1: 代表在大的div中  >=0 代表在分类项小div中
      currentIndex: -2, // 需要显示子列表的一级分类项的下标
      isShowFirst: false,
    };
  },

  computed: {
    ...mapState({
      // 计算属性值由vuex内部调用此回调函数(传入总state)得到返回值作为属性值
      // state: store的总状态
      newList: (state) => state.home.baseCategoryList,
    }),
  },
  created() {
    this.isShowFirst = this.$route.path === "/";
  },
  mounted() {
    // 通过异步action获取异步获取数据到vuex的state中
    this.$store.dispatch("getBaseCategoryList");
  },

  methods: {
    showCategory() {
      this.isShowFirst = true;
      this.currentIndex = -1;
    },
    hideCategory() {
      this.currentIndex = -2;
      if (this.$route.path !== "/") {
        this.isShowFirst = false;
      }
    },
    showSubCategorys: throttle(function(index) {
      if (this.currentIndex === -2) return; // 如果已经完全移出去了, 不做更新
      // 更新需要显示子分类的下标
      this.currentIndex = index;
      // 会导致列表更新(浏览器在更新过程中没办法去响应后面mouseenter)  ==> 实际上就是界面卡了 不太好
      // 理想: 不去特别频繁的更新数据(更新界面)   ==> 使用节流
    }, 200),
    toSearch(event) {
      const {
        categoryname,
        category1id,
        category2id,
        category3id,
      } = event.target.dataset;
      // 如何判断点击的分类项<a>
      if (categoryname) {
        // 只有所有的分类项的a指定了data-categoryName属性
        // 准备query参数对象
        const query = { categoryName: categoryname };
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else if (category3id) {
          query.category3Id = category3id;
        }

        this.$router.push({
          name: "search",
          query,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &.item_on {
            background: #ccc;
            .item-list {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
