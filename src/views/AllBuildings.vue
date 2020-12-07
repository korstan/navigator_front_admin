<template>
  <div>
    <h1 class="title">Здания</h1>
    <b-menu>
      <b-loading v-model="isLoading"></b-loading>
      <b-menu-list v-if="!isLoading">
        <BuildingItem v-for="building in buildings" :key="building.id" v-bind="building"></BuildingItem>
        <AddNewMenuItem label="здание" @click="showModal" />
      </b-menu-list>
    </b-menu>
    <NewBuildingModal 
      :visible="isModalVisible"
      @close="hideModal"
      @submit="submitNewBuilding"
    />
  </div>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import BuildingItem from '@/components/AllBuildings/BuildingItem';
import NewBuildingModal from '@/components/AllBuildings/NewBuildingModal';

import coreApi from '@/services/api/core';
import adminApi from '@/services/api/admin';

export default {
  components: {
    AddNewMenuItem,
    BuildingItem,
    NewBuildingModal
  },
  data() {
    return {
      isLoading: false,
      isModalVisible: false,
      buildings: [],
    }
  },
  methods: {
    showModal: function () {
      this.isModalVisible = true;
    },
    hideModal: function () {
      this.isModalVisible = false;
    },
    submitNewBuilding: async function(newBuilding) {
      const response = await adminApi.createBuilding(newBuilding);
      if(!response.error) {
        this.buildings.push(response);
      }
      this.hideModal();
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
