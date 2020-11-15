<template>
  <div>
    <h1 class="title">Здания</h1>
    <b-menu>
      <b-loading v-model="isLoading"></b-loading>
      <b-menu-list v-if="!isLoading">
        <BuildingItem v-for="building in buildings" :key="building.id" v-bind="building"></BuildingItem>
        <AddNewMenuItem label="здание" />
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import BuildingItem from '@/components/AllBuildings/BuildingItem';
import coreApi from '@/services/api/core';

export default {
  components: {
    AddNewMenuItem,
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
};
</script>

<style></style>
