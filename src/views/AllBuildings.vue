<template>
  <div>
    <h1 class="title">Здания</h1>
    <b-menu :activable="false">
      <b-loading v-model="isLoading"></b-loading>
      <b-menu-list v-if="!isLoading">
        <BuildingItem
          v-for="building in buildings"
          :key="building.id"
          v-bind="building"
          @edit="onEdit"
          @remove="onRemove"
        >
        </BuildingItem>
        <AddNewMenuItem label="здание" @click="showModal('new')" />
      </b-menu-list>
    </b-menu>
    <NewBuildingModal
      :visible="visibleModal === 'new'"
      @close="hideModal"
      @submit="submitNewBuilding"
    />
    <ConfirmRemoveModal
      :visible="visibleModal === 'remove'"
      :title="selectedBuilding.title"
      @close="hideModal"
      @remove="removeSelectedBuilding"
    />
    <EditBuildingModal
      v-if="visibleModal === 'edit'"
      :visible="visibleModal === 'edit'"
      :initialBuilding="selectedBuilding"
      @submit="updateBuilding"
      @close="hideModal"
    />
  </div>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import BuildingItem from '@/components/AllBuildings/BuildingItem';
import NewBuildingModal from '@/components/AllBuildings/NewBuildingModal';
import ConfirmRemoveModal from '@/components/ConfirmRemoveModal';
import EditBuildingModal from '@/components/AllBuildings/EditBuildingModal';

import coreApi from '@/services/api/core';
import adminApi from '@/services/api/admin';

export default {
  components: {
    AddNewMenuItem,
    BuildingItem,
    NewBuildingModal,
    ConfirmRemoveModal,
    EditBuildingModal,
  },
  data() {
    return {
      isLoading: false,
      visibleModal: undefined,
      buildings: [],
      selectedBuilding: {
        id: undefined,
        title: undefined,
      }
    }
  },
  methods: {
    showModal: function (modalName) {
      this.visibleModal = modalName;
    },
    hideModal: function () {
      this.visibleModal = undefined;
    },
    submitNewBuilding: async function(newBuilding) {
      const response = await adminApi.createBuilding(newBuilding);
      if(!response.error) {
        this.buildings.push(response);
      }
      this.hideModal();
    },
    setSelectedBuilding(id) {
      this.selectedBuilding = this.buildings.find(b => b.id === id);
    },
    onEdit(id) {
      this.setSelectedBuilding(id);
      this.showModal('edit');
    },
    onRemove(id) {
      this.setSelectedBuilding(id);
      this.showModal('remove');
    },
    updateBuilding: async function({id, title}) {
      const response = await adminApi.updateBuilding({id, title});
      if(!response.error) {
        this.buildings = this.buildings.map(b=>b.id === response.id ? response : b);
        this.hideModal();
      }
    },
    removeSelectedBuilding: async function() {
      const response = await adminApi.removeBuilding(this.selectedBuilding.id);
      if(!response.error) {
        this.buildings = this.buildings.filter(b => b.id != response.id);
        this.hideModal();
      }
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
