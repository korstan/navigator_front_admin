<template>
  <div>
    <h1 class="title">Здания</h1>
    <b-menu>
      <b-menu-list>
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
      buildings: [],
    }
  },

  created: async function() {
    this.buildings = await coreApi.getBuildings();
  },
};
</script>

<style></style>
