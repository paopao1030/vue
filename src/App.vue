<template>
  <div>
    <Header />
    <router-view></router-view>
    <!-- <Footer v-show="$route.path !== '/register' && $route.path !== '/login'" /> -->
    <Footer v-show="!$route.meta.isHideFooter" />
  </div>
</template>

<script>
import Header from "@/components/header";
import Footer from "@/components/footer";
import { reqFloors } from "./api/index";
export default {
  name: "App",
  async mounted() {
    //测试mock接口数据
    const result = await reqFloors();
    console.log(result);
    this.$store.dispatch("getBaseCategoryList");
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style></style>
