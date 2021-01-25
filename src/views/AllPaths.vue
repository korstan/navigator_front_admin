<template>
  <div>
    <h1 class="title">Маршрутные точки</h1>
    <b-menu :activable="false">
      <b-loading v-model="isLoading"></b-loading>
      <b-menu-list v-if="!isLoading">
        <BuildingItem
          v-for="building in buildings"
          :key="building.id"
          v-bind="building"
          :hideActions="true"
          @route="$router.push(`/paths/${building.id}?title=${building.title}`)"
        >
        </BuildingItem>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script>
import BuildingItem from '@/components/AllBuildings/BuildingItem';

import coreApi from '@/services/api/core';

export default {
  components: {
    BuildingItem,
  },
  data() {
    return {
      isLoading: false,
      buildings: [],
    }
  },
  created: async function() {
    this.isLoading = true;
    this.buildings = await coreApi.getBuildings();
    this.isLoading = false;
  },
}
</script>

<style>

</style>