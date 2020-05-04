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

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style></style>
