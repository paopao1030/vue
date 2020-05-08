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
    this.$store.dispatch("getFloors");
    this.$store.dispatch("getBanners");
    this.$store.dispatch("getBaseCategoryList");
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style></style>
