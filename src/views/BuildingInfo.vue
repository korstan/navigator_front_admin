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
        />
        <AddNewMenuItem label="локацию" @click="showModal" />
      </b-menu-list>
    </b-menu>

    <NewLocationModal
      :visible="isModalVisible"
      @close="hideModal"
      @submit="submitNewLocation"
    />
  </div>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import LevelMenuItem from '@/components/BuildingInfo/LevelMenuItem';
import NewLocationModal from '@/components/BuildingInfo/NewLocationModal';

import coreApi from '@/services/api/core';
import adminApi from '@/services/api/admin';

export default {
  name: 'BuildingInfo',
  components: { AddNewMenuItem, LevelMenuItem, NewLocationModal },
  data() {
    return {
      isLoading: false,
      locations: [],
      isModalVisible: false,
    };
  },
  methods: {
    showModal: function() {
      this.isModalVisible = true;
    },
    hideModal: function() {
      this.isModalVisible = false;
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
  },
  props: {
    title: String,
  },
  created: async function() {
    this.isLoading = true;
    this.locations = await coreApi.getLevels(this.$route.params.id);
    this.isLoading = false;
  },
};
</script>

<style></style>
