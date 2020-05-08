<template>
  <div>
    <TypeNav> </TypeNav>
    <ListContainer />
    <TodayRecommend />
    <Rank />
    <Like />
    <Floor v-for="floor in floors" :key="floor.id" :floor="floor" />
    <Brand />
  </div>
</template>

<script>
import { mapState } from "vuex";
import ListContainer from "./ListContainer";
import TodayRecommend from "./TodayRecommend";
import Rank from "./Rank/Rank";
import Like from "./Like/Like";
import Floor from "./Floor/Floor";
import Brand from "./Brand/Brand";
export default {
  computed: {
    ...mapState({
      floors: (state) => state.home.floors,
    }),
  },
  components: {
    ListContainer,
    TodayRecommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
};
</script>

<style></style>
