<template>
  <div>
    <h1>我是搜索组件:params为{{ $route.params.keyworld }}</h1>
    <h1>我是搜索组件:query为{{ $route.query.name }}</h1>
    <h2>params=>props={{ keyworld1 }}</h2>
    <h2>query=>props={{ keywold2 }}</h2>
  </div>
</template>

<script>
export default {
  props: ["keyworld1", "keywold2"],
};
</script>

<style></style>
