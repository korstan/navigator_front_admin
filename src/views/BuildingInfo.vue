<template>
  <div>
    <h1 class="title">{{ title }}</h1>
    <b-loading v-model="isLoading"></b-loading>
    <b-menu :activable="false">
      <b-menu-list v-if="!isLoading">
        <LevelMenuItem
          v-for="location in locations"
          :key="location.id"
          v-bind="location"
          @edit="onEdit"
          @remove="onRemove"
        />
        <AddNewMenuItem label="локацию" @click="showModal('new')" />
      </b-menu-list>
    </b-menu>

    <NewLocationModal
      :visible="visibleModal === 'new'"
      @close="hideModal"
      @submit="submitNewLocation"
    />
    <ConfirmRemoveModal
      :visible="visibleModal === 'remove'"
      :title="selectedLocation.title"
      @close="hideModal"
      @remove="removeSelectedLocation"
    />
    <EditLocationModal
      v-if="visibleModal === 'edit'"
      :visible="visibleModal === 'edit'"
      :initialLocation="selectedLocation"
      :buildingId="$route.params.id"
      @submit="updateLocation"
      @close="hideModal"
    />
  </div>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import LevelMenuItem from '@/components/BuildingInfo/LevelMenuItem';
import NewLocationModal from '@/components/BuildingInfo/NewLocationModal';
import ConfirmRemoveModal from '@/components/ConfirmRemoveModal';
import EditLocationModal from '@/components/BuildingInfo/EditLocationModal';

import coreApi from '@/services/api/core';
import adminApi from '@/services/api/admin';

export default {
  name: 'BuildingInfo',
  components: { 
    AddNewMenuItem, 
    LevelMenuItem, 
    NewLocationModal,
    ConfirmRemoveModal,
    EditLocationModal
  },
  props: {
    title: String,
  },
  data() {
    return {
      isLoading: false,
      visibleModal: undefined,
      locations: [],
      isModalVisible: false,
      selectedLocation: {},
    };
  },
  methods: {
    showModal: function (modalName) {
      this.visibleModal = modalName;
    },
    hideModal: function () {
      this.visibleModal = undefined;
    },
    setSelectedLocation({id, level}) {
      let foundLocation = this.locations
          .find(l=> l.level === level)
          .locations
          .find(l=>l.id === id);
      this.selectedLocation = {
        id,
        level,
        title: foundLocation.title,
        x: foundLocation.points.x1,
        y: foundLocation.points.y1,
        x_entry: foundLocation.entryPoints.x,
        y_entry: foundLocation.entryPoints.y,
        pathPointId: foundLocation.pathPointId,
      }
    },
    onEdit(obj) {
      this.setSelectedLocation(obj);
      this.showModal('edit');
    },
    onRemove(obj) {
      this.setSelectedLocation(obj);
      this.showModal('remove');
    },
    submitNewLocation: async function(newLocation) {
      const response = await adminApi.createLocation({
        buildingId: this.$route.params.id,
        ...newLocation,
      });
      if (!response.error) {
        if (this.locations.find((l) => l.level == response.level))
          this.locations = this.locations.map((l) =>
            l.level == response.level
              ? { ...l, locations: [...l.locations, response.location] }
              : l,
          );
        else
          this.locations.push({
            level: response.level,
            locations: [response.location],
          });
      }
      this.hideModal();
    },
    updateLocation: async function(updatedLocation) {
      const response = await adminApi.updateLocation(updatedLocation);
      if(!response.error) {
        let mappedResponse = {
          id: response.id,
          points: { x1: response.x, y1: response.y},
          entryPoints: { x: response.x_entry, y: response.y_entry },
          title: response.title,
          pathPointId: response.pathPointId
        }

        this.locations = this.locations
          .map(l => ({...l, locations: l.locations.filter(loc => loc.id != response.id) }));

        if (this.locations.find((l) => l.level == response.level))
          this.locations = this.locations.map((l) =>
            l.level == response.level
              ? { ...l, locations: [...l.locations, mappedResponse] }
              : l,
          );
        else
          this.locations.push({
            level: response.level,
            locations: [mappedResponse],
          });
        this.hideModal();
      }
    },
    removeSelectedLocation: async function() {
      const response = await adminApi.removeLocation(this.selectedLocation.id);
      if(!response.error) {
        this.locations = this.locations
          .map(l => ({...l, locations: l.locations.filter(loc => loc.id != response.id) }));
        this.hideModal();
      }
    },
  },
  created: async function() {
    this.isLoading = true;
    this.locations = await coreApi.getLevels(this.$route.params.id);
    this.isLoading = false;
  },
};
</script>

<style></style>
